export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  unlockedAt?: number;
}

export interface UserStats {
  userId: string;
  totalCasesHandled: number;
  signedCases: number;
  responseTimeAverage: number;
  badges: Badge[];
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  totalPoints: number;
  signedCases: number;
  responseScore: number;
  level: number;
}

const BADGES_LIBRARY: Record<string, Badge> = {
  first_case: {
    id: "first_case",
    name: "First Case",
    description: "Handle your first case",
    icon: "🎯",
    rarity: "common",
  },
  speed_demon: {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Respond to 5 cases within 1 hour",
    icon: "⚡",
    rarity: "uncommon",
  },
  perfect_score: {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Achieve 100/100 response score",
    icon: "💯",
    rarity: "rare",
  },
  signed_master: {
    id: "signed_master",
    name: "Signed Master",
    description: "Sign 50 cases",
    icon: "✍️",
    rarity: "rare",
  },
  streak_warrior: {
    id: "streak_warrior",
    name: "Streak Warrior",
    description: "Maintain a 30-day response streak",
    icon: "🔥",
    rarity: "legendary",
  },
  market_leader: {
    id: "market_leader",
    name: "Market Leader",
    description: "Rank #1 in your market",
    icon: "👑",
    rarity: "legendary",
  },
};

export class GamificationEngine {
  private userStats: Map<string, UserStats> = new Map();
  private storageKey = "caseport_gamification";

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Get or create user stats
   */
  getUserStats(userId: string): UserStats {
    if (!this.userStats.has(userId)) {
      this.userStats.set(userId, {
        userId,
        totalCasesHandled: 0,
        signedCases: 0,
        responseTimeAverage: 0,
        badges: [],
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
        level: 1,
      });
    }
    return this.userStats.get(userId)!;
  }

  /**
   * Award points to user
   */
  awardPoints(userId: string, points: number, reason: string): void {
    const stats = this.getUserStats(userId);
    stats.totalPoints += points;

    // Level up every 1000 points
    const newLevel = Math.floor(stats.totalPoints / 1000) + 1;
    if (newLevel > stats.level) {
      stats.level = newLevel;
    }

    this.checkAndUnlockBadges(userId);
    this.saveToStorage();
  }

  /**
   * Record case handling
   */
  recordCaseHandled(userId: string, signed: boolean, responseTime: number): void {
    const stats = this.getUserStats(userId);
    stats.totalCasesHandled += 1;

    if (signed) {
      stats.signedCases += 1;
      this.awardPoints(userId, 100, "Case signed");
    } else {
      this.awardPoints(userId, 25, "Case handled");
    }

    // Update response time average
    stats.responseTimeAverage =
      (stats.responseTimeAverage * (stats.totalCasesHandled - 1) + responseTime) /
      stats.totalCasesHandled;

    this.checkAndUnlockBadges(userId);
    this.saveToStorage();
  }

  /**
   * Update streak
   */
  updateStreak(userId: string, responded: boolean): void {
    const stats = this.getUserStats(userId);

    if (responded) {
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
      }
      this.awardPoints(userId, 50, "Streak maintained");
    } else {
      stats.currentStreak = 0;
    }

    this.checkAndUnlockBadges(userId);
    this.saveToStorage();
  }

  /**
   * Check and unlock badges
   */
  private checkAndUnlockBadges(userId: string): void {
    const stats = this.getUserStats(userId);
    const unlockedIds = stats.badges.map((b) => b.id);

    // Check each badge condition
    if (stats.totalCasesHandled >= 1 && !unlockedIds.includes("first_case")) {
      this.unlockBadge(userId, "first_case");
    }

    if (stats.signedCases >= 50 && !unlockedIds.includes("signed_master")) {
      this.unlockBadge(userId, "signed_master");
    }

    if (stats.longestStreak >= 30 && !unlockedIds.includes("streak_warrior")) {
      this.unlockBadge(userId, "streak_warrior");
    }
  }

  /**
   * Unlock badge
   */
  private unlockBadge(userId: string, badgeId: string): void {
    const stats = this.getUserStats(userId);
    const badge = BADGES_LIBRARY[badgeId];

    if (badge && !stats.badges.find((b) => b.id === badgeId)) {
      const unlockedBadge = { ...badge, unlockedAt: Date.now() };
      stats.badges.push(unlockedBadge);
      this.awardPoints(userId, 250, `Badge unlocked: ${badge.name}`);
    }
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(limit: number = 10): LeaderboardEntry[] {
    const entries: LeaderboardEntry[] = Array.from(this.userStats.values()).map(
      (stats, idx) => ({
        rank: idx + 1,
        userId: stats.userId,
        userName: `User ${stats.userId.slice(0, 8)}`,
        totalPoints: stats.totalPoints,
        signedCases: stats.signedCases,
        responseScore: Math.round(100 - stats.responseTimeAverage),
        level: stats.level,
      })
    );

    return entries
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }

  /**
   * Get user rank
   */
  getUserRank(userId: string): number {
    const leaderboard = this.getLeaderboard(this.userStats.size);
    const entry = leaderboard.find((e) => e.userId === userId);
    return entry?.rank || 0;
  }

  /**
   * Save to storage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.userStats.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save gamification data:", error);
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
        this.userStats = new Map(data);
      }
    } catch (error) {
      console.error("Failed to load gamification data:", error);
    }
  }
}

export const gamificationEngine = new GamificationEngine();
