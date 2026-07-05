import { EventEmitter } from 'events';

export interface Notification {
  id: string;
  userId: string;
  type: 'opportunity' | 'rank_change' | 'wallet_update' | 'case_accepted' | 'case_rejected';
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface TriggerPayload {
  caseType: string;
  market: string;
  urgency: 'high' | 'medium' | 'low'; // expires in 2h, 6h, 24h
  conversionProbability: number; // 0-100
  estimatedValue?: number; // Hidden until acceptance
  caseId: string;
  expiresIn: number; // milliseconds
}

class NotificationService extends EventEmitter {
  private notifications: Map<string, Notification[]> = new Map();
  private activeConnections: Map<string, Set<string>> = new Map(); // userId -> Set of connectionIds

  /**
   * Send real-time trigger notification to user
   * This is the dopamine hit that starts the hook loop
   */
  async sendTriggerNotification(userId: string, payload: TriggerPayload): Promise<void> {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'opportunity',
      title: `New ${payload.caseType} in ${payload.market}`,
      message: `${payload.conversionProbability}% likely to convert • Expires in ${this.getUrgencyLabel(payload.urgency)}`,
      data: {
        caseId: payload.caseId,
        caseType: payload.caseType,
        market: payload.market,
        conversionProbability: payload.conversionProbability,
        urgency: payload.urgency,
        expiresIn: payload.expiresIn,
      },
      read: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + payload.expiresIn),
    };

    // Store notification
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)!.push(notification);

    // Emit to all active connections for this user
    this.emit(`notification:${userId}`, notification);

    // Broadcast badge count update
    this.broadcastBadgeUpdate(userId);
  }

  /**
   * Send rank change notification (creates urgency)
   */
  async sendRankChangeNotification(userId: string, oldRank: number, newRank: number): Promise<void> {
    const isImprovement = newRank < oldRank;
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'rank_change',
      title: isImprovement ? 'You moved up' : 'You dropped in rank',
      message: isImprovement
        ? `You're now #${newRank} of 156 firms`
        : `You dropped to #${newRank} — accept more cases to climb back`,
      data: {
        oldRank,
        newRank,
        isImprovement,
      },
      read: false,
      createdAt: new Date(),
    };

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)!.push(notification);

    this.emit(`notification:${userId}`, notification);
    this.broadcastBadgeUpdate(userId);
  }

  /**
   * Send wallet update notification (creates scarcity)
   */
  async sendWalletUpdateNotification(userId: string, newBalance: number, caseValue: number): Promise<void> {
    const isLow = newBalance < 5000; // Alert threshold
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'wallet_update',
      title: isLow ? 'Low wallet balance' : 'Wallet updated',
      message: isLow
        ? `Your balance is now $${newBalance.toLocaleString()}. Refund soon to stay active.`
        : `Case delivered: -$${caseValue.toLocaleString()} • Balance: $${newBalance.toLocaleString()}`,
      data: {
        newBalance,
        caseValue,
        isLow,
      },
      read: false,
      createdAt: new Date(),
    };

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)!.push(notification);

    this.emit(`notification:${userId}`, notification);
    this.broadcastBadgeUpdate(userId);
  }

  /**
   * Get unread notification count for badge
   */
  getUnreadCount(userId: string): number {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter((n) => !n.read && (!n.expiresAt || n.expiresAt > new Date())).length;
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const notification = userNotifications.find((n) => n.id === notificationId);
      if (notification) {
        notification.read = true;
        this.broadcastBadgeUpdate(userId);
      }
    }
  }

  /**
   * Get all notifications for user (paginated)
   */
  getNotifications(userId: string, limit: number = 20, offset: number = 0): Notification[] {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications
      .filter((n) => !n.expiresAt || n.expiresAt > new Date())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  /**
   * Broadcast badge count to all active connections
   */
  private broadcastBadgeUpdate(userId: string): void {
    const count = this.getUnreadCount(userId);
    this.emit(`badge:${userId}`, count);
  }

  /**
   * Register active WebSocket connection
   */
  registerConnection(userId: string, connectionId: string): void {
    if (!this.activeConnections.has(userId)) {
      this.activeConnections.set(userId, new Set());
    }
    this.activeConnections.get(userId)!.add(connectionId);
  }

  /**
   * Unregister WebSocket connection
   */
  unregisterConnection(userId: string, connectionId: string): void {
    const connections = this.activeConnections.get(userId);
    if (connections) {
      connections.delete(connectionId);
      if (connections.size === 0) {
        this.activeConnections.delete(userId);
      }
    }
  }

  /**
   * Check if user has active connections
   */
  hasActiveConnections(userId: string): boolean {
    return this.activeConnections.has(userId) && this.activeConnections.get(userId)!.size > 0;
  }

  /**
   * Clean up expired notifications
   */
  cleanupExpiredNotifications(): void {
    const now = new Date();
    const entriesToDelete: string[] = [];
    this.notifications.forEach((notifications: Notification[], userId: string) => {
      const filtered = notifications.filter((n: Notification) => !n.expiresAt || n.expiresAt > now);
      if (filtered.length === 0) {
        entriesToDelete.push(userId);
      } else {
        this.notifications.set(userId, filtered);
      }
    });
    entriesToDelete.forEach((userId) => this.notifications.delete(userId));
  }

  private getUrgencyLabel(urgency: string): string {
    switch (urgency) {
      case 'high':
        return '2 hours';
      case 'medium':
        return '6 hours';
      case 'low':
        return '24 hours';
      default:
        return 'soon';
    }
  }
}

export const notificationService = new NotificationService();

// Cleanup expired notifications every 5 minutes
setInterval(() => {
  notificationService.cleanupExpiredNotifications();
}, 5 * 60 * 1000);
