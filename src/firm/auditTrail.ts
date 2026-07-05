export type AuditAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "export"
  | "submit"
  | "approve"
  | "reject"
  | "filter"
  | "search";

export interface AuditEntry {
  id: string;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditTrail {
  private entries: AuditEntry[] = [];
  private maxEntries = 10000;
  private storageKey = "caseport_audit_trail";

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Log an action to the audit trail
   */
  log(
    userId: string,
    action: AuditAction,
    resource: string,
    resourceId: string,
    details?: Record<string, unknown>
  ): AuditEntry {
    const entry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      resource,
      resourceId,
      details: details || {},
      timestamp: Date.now(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    };

    this.entries.push(entry);

    // Keep only recent entries
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    this.saveToStorage();
    return entry;
  }

  /**
   * Get all audit entries
   */
  getAll(): AuditEntry[] {
    return [...this.entries];
  }

  /**
   * Get entries filtered by user
   */
  getByUser(userId: string): AuditEntry[] {
    return this.entries.filter((e) => e.userId === userId);
  }

  /**
   * Get entries filtered by resource
   */
  getByResource(resource: string, resourceId?: string): AuditEntry[] {
    return this.entries.filter(
      (e) => e.resource === resource && (!resourceId || e.resourceId === resourceId)
    );
  }

  /**
   * Get entries filtered by action
   */
  getByAction(action: AuditAction): AuditEntry[] {
    return this.entries.filter((e) => e.action === action);
  }

  /**
   * Get entries within date range
   */
  getByDateRange(startTime: number, endTime: number): AuditEntry[] {
    return this.entries.filter(
      (e) => e.timestamp >= startTime && e.timestamp <= endTime
    );
  }

  /**
   * Get recent entries
   */
  getRecent(limit: number = 50): AuditEntry[] {
    return this.entries.slice(-limit).reverse();
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.entries = [];
    this.saveToStorage();
  }

  /**
   * Export audit trail as CSV
   */
  exportAsCSV(): string {
    const headers = [
      "ID",
      "User ID",
      "Action",
      "Resource",
      "Resource ID",
      "Timestamp",
      "Details",
    ];
    const rows = this.entries.map((e) => [
      e.id,
      e.userId,
      e.action,
      e.resource,
      e.resourceId,
      new Date(e.timestamp).toISOString(),
      JSON.stringify(e.details),
    ]);

    const csv = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    return csv;
  }

  /**
   * Get statistics about audit trail
   */
  getStatistics(): {
    totalEntries: number;
    uniqueUsers: number;
    actionCounts: Record<AuditAction, number>;
    resourceCounts: Record<string, number>;
  } {
    const actionCounts: Record<AuditAction, number> = {} as Record<AuditAction, number>;
    const resourceCounts: Record<string, number> = {};
    const uniqueUsers = new Set<string>();

    this.entries.forEach((e) => {
      uniqueUsers.add(e.userId);
      actionCounts[e.action] = (actionCounts[e.action] || 0) + 1;
      resourceCounts[e.resource] = (resourceCounts[e.resource] || 0) + 1;
    });

    return {
      totalEntries: this.entries.length,
      uniqueUsers: uniqueUsers.size,
      actionCounts,
      resourceCounts,
    };
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
    } catch (error) {
      console.error("Failed to save audit trail:", error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.entries = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load audit trail:", error);
      this.entries = [];
    }
  }
}

// Global audit trail instance
export const auditTrail = new AuditTrail();
