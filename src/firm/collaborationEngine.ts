export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  mentions: string[];
  replies: Comment[];
  resolved: boolean;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  action: "created" | "updated" | "commented" | "submitted" | "disputed" | "resolved";
  resourceType: "opportunity" | "outcome" | "case" | "comment";
  resourceId: string;
  description: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface Mention {
  userId: string;
  userName: string;
  email: string;
  mentioned: boolean;
  notified: boolean;
}

export class CollaborationEngine {
  private comments: Map<string, Comment[]> = new Map();
  private activityFeed: ActivityFeedItem[] = [];
  private mentions: Map<string, Mention[]> = new Map();
  private storageKey = "caseport_collaboration";

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Add comment to resource
   */
  addComment(
    resourceId: string,
    authorId: string,
    authorName: string,
    content: string,
    mentions: string[] = []
  ): Comment {
    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId,
      authorName,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mentions,
      replies: [],
      resolved: false,
    };

    if (!this.comments.has(resourceId)) {
      this.comments.set(resourceId, []);
    }
    this.comments.get(resourceId)!.push(comment);

    // Log activity
    this.logActivity(
      authorId,
      authorName,
      "commented",
      "comment",
      resourceId,
      `Commented on case: "${content.substring(0, 50)}..."`
    );

    // Notify mentioned users
    mentions.forEach((userId) => {
      this.notifyMention(resourceId, userId, authorName);
    });

    this.saveToStorage();
    return comment;
  }

  /**
   * Reply to comment
   */
  replyToComment(
    resourceId: string,
    commentId: string,
    authorId: string,
    authorName: string,
    content: string,
    mentions: string[] = []
  ): Comment | undefined {
    const comments = this.comments.get(resourceId);
    if (!comments) return undefined;

    const findAndReply = (comments: Comment[]): Comment | undefined => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          const reply: Comment = {
            id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorId,
            authorName,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            mentions,
            replies: [],
            resolved: false,
          };
          comment.replies.push(reply);
          return reply;
        }
        const result = findAndReply(comment.replies);
        if (result) return result;
      }
      return undefined;
    };

    const reply = findAndReply(comments);
    if (reply) {
      this.saveToStorage();
    }
    return reply;
  }

  /**
   * Get comments for resource
   */
  getComments(resourceId: string): Comment[] {
    return this.comments.get(resourceId) || [];
  }

  /**
   * Resolve comment
   */
  resolveComment(resourceId: string, commentId: string): void {
    const comments = this.comments.get(resourceId);
    if (!comments) return;

    const findAndResolve = (comments: Comment[]): boolean => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          comment.resolved = true;
          return true;
        }
        if (findAndResolve(comment.replies)) return true;
      }
      return false;
    };

    if (findAndResolve(comments)) {
      this.saveToStorage();
    }
  }

  /**
   * Log activity
   */
  private logActivity(
    userId: string,
    userName: string,
    action: ActivityFeedItem["action"],
    resourceType: ActivityFeedItem["resourceType"],
    resourceId: string,
    description: string,
    metadata?: Record<string, unknown>
  ): void {
    const item: ActivityFeedItem = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      action,
      resourceType,
      resourceId,
      description,
      timestamp: Date.now(),
      metadata,
    };

    this.activityFeed.unshift(item);

    // Keep only last 500 items
    if (this.activityFeed.length > 500) {
      this.activityFeed = this.activityFeed.slice(0, 500);
    }

    this.saveToStorage();
  }

  /**
   * Get activity feed
   */
  getActivityFeed(limit: number = 50): ActivityFeedItem[] {
    return this.activityFeed.slice(0, limit);
  }

  /**
   * Get activity for resource
   */
  getResourceActivity(resourceId: string, limit: number = 20): ActivityFeedItem[] {
    return this.activityFeed
      .filter((item) => item.resourceId === resourceId)
      .slice(0, limit);
  }

  /**
   * Notify mention
   */
  private notifyMention(resourceId: string, userId: string, mentionedBy: string): void {
    if (!this.mentions.has(resourceId)) {
      this.mentions.set(resourceId, []);
    }

    const mentions = this.mentions.get(resourceId)!;
    const existing = mentions.find((m) => m.userId === userId);

    if (existing) {
      existing.mentioned = true;
      existing.notified = false;
    } else {
      mentions.push({
        userId,
        userName: `User ${userId}`,
        email: `user${userId}@example.com`,
        mentioned: true,
        notified: false,
      });
    }

    this.saveToStorage();
  }

  /**
   * Get mentions for resource
   */
  getMentions(resourceId: string): Mention[] {
    return this.mentions.get(resourceId) || [];
  }

  /**
   * Mark mention as notified
   */
  markMentionNotified(resourceId: string, userId: string): void {
    const mentions = this.mentions.get(resourceId);
    if (mentions) {
      const mention = mentions.find((m) => m.userId === userId);
      if (mention) {
        mention.notified = true;
        this.saveToStorage();
      }
    }
  }

  /**
   * Get unread mentions
   */
  getUnreadMentions(userId: string): Mention[] {
    const unread: Mention[] = [];
    this.mentions.forEach((mentions) => {
      mentions.forEach((mention) => {
        if (mention.userId === userId && mention.mentioned && !mention.notified) {
          unread.push(mention);
        }
      });
    });
    return unread;
  }

  /**
   * Save to storage
   */
  private saveToStorage(): void {
    try {
      const data = {
        comments: Array.from(this.comments.entries()),
        activityFeed: this.activityFeed,
        mentions: Array.from(this.mentions.entries()),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save collaboration data:", error);
    }
  }

  /**
   * Load from storage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.comments = new Map(data.comments);
        this.activityFeed = data.activityFeed || [];
        this.mentions = new Map(data.mentions);
      }
    } catch (error) {
      console.error("Failed to load collaboration data:", error);
    }
  }
}

export const collaborationEngine = new CollaborationEngine();
