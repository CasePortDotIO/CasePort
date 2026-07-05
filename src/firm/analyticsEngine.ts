export interface CohortData {
  cohortId: string;
  cohortDate: number;
  size: number;
  retention: Record<number, number>; // week -> retention %
  revenue: number;
  avgCaseValue: number;
}

export interface FunnelStep {
  name: string;
  count: number;
  conversionRate: number;
  dropoff: number;
}

export interface RetentionMetric {
  period: string;
  retained: number;
  churned: number;
  retentionRate: number;
}

export interface AttributionModel {
  channel: string;
  conversions: number;
  revenue: number;
  roi: number;
  cost: number;
}

export interface AnalyticsMetrics {
  totalCases: number;
  signedCases: number;
  conversionRate: number;
  avgResponseTime: number;
  avgCaseValue: number;
  totalRevenue: number;
  roi: number;
  churnRate: number;
}

export class AnalyticsEngine {
  private caseData: Array<{
    id: string;
    createdAt: number;
    signedAt?: number;
    value: number;
    source: string;
    responseTime: number;
    status: "contacted" | "signed" | "lost";
  }> = [];

  /**
   * Add case data
   */
  addCase(caseData: {
    id: string;
    createdAt: number;
    signedAt?: number;
    value: number;
    source: string;
    responseTime: number;
    status: "contacted" | "signed" | "lost";
  }): void {
    this.caseData.push(caseData);
  }

  /**
   * Get cohort analysis
   */
  getCohortAnalysis(): CohortData[] {
    const cohorts: Map<number, CohortData> = new Map();

    this.caseData.forEach((c) => {
      const cohortDate = Math.floor(c.createdAt / (7 * 24 * 60 * 60 * 1000)) * (7 * 24 * 60 * 60 * 1000);

      if (!cohorts.has(cohortDate)) {
        cohorts.set(cohortDate, {
          cohortId: `cohort_${cohortDate}`,
          cohortDate,
          size: 0,
          retention: {},
          revenue: 0,
          avgCaseValue: 0,
        });
      }

      const cohort = cohorts.get(cohortDate)!;
      cohort.size += 1;
      if (c.status === "signed") {
        cohort.revenue += c.value;
      }
    });

    return Array.from(cohorts.values()).sort((a, b) => a.cohortDate - b.cohortDate);
  }

  /**
   * Get funnel analysis
   */
  getFunnelAnalysis(): FunnelStep[] {
    const total = this.caseData.length;
    const contacted = this.caseData.filter((c) => c.status === "contacted").length;
    const signed = this.caseData.filter((c) => c.status === "signed").length;

    return [
      {
        name: "Opportunities",
        count: total,
        conversionRate: 100,
        dropoff: 0,
      },
      {
        name: "Contacted",
        count: contacted,
        conversionRate: (contacted / total) * 100,
        dropoff: total - contacted,
      },
      {
        name: "Signed",
        count: signed,
        conversionRate: (signed / total) * 100,
        dropoff: contacted - signed,
      },
    ];
  }

  /**
   * Get retention analysis
   */
  getRetentionAnalysis(): RetentionMetric[] {
    const metrics: RetentionMetric[] = [];
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;

    const casesInPeriod = (startDate: number, endDate: number) =>
      this.caseData.filter((c) => c.createdAt >= startDate && c.createdAt <= endDate);

    const calculateRetention = (cases: typeof this.caseData) => {
      const signed = cases.filter((c) => c.status === "signed").length;
      const total = cases.length;
      return total > 0 ? (signed / total) * 100 : 0;
    };

    const last30 = casesInPeriod(thirtyDaysAgo, now);
    const last60 = casesInPeriod(sixtyDaysAgo, thirtyDaysAgo);
    const last90 = casesInPeriod(ninetyDaysAgo, sixtyDaysAgo);

    metrics.push({
      period: "Last 30 Days",
      retained: last30.filter((c) => c.status === "signed").length,
      churned: last30.filter((c) => c.status === "lost").length,
      retentionRate: calculateRetention(last30),
    });

    metrics.push({
      period: "60-90 Days Ago",
      retained: last60.filter((c) => c.status === "signed").length,
      churned: last60.filter((c) => c.status === "lost").length,
      retentionRate: calculateRetention(last60),
    });

    metrics.push({
      period: "90-120 Days Ago",
      retained: last90.filter((c) => c.status === "signed").length,
      churned: last90.filter((c) => c.status === "lost").length,
      retentionRate: calculateRetention(last90),
    });

    return metrics;
  }

  /**
   * Get attribution analysis
   */
  getAttributionAnalysis(): AttributionModel[] {
    const channels: Map<string, AttributionModel> = new Map();

    this.caseData.forEach((c) => {
      if (!channels.has(c.source)) {
        channels.set(c.source, {
          channel: c.source,
          conversions: 0,
          revenue: 0,
          roi: 0,
          cost: 0,
        });
      }

      const channel = channels.get(c.source)!;
      if (c.status === "signed") {
        channel.conversions += 1;
        channel.revenue += c.value;
      }
    });

    return Array.from(channels.values());
  }

  /**
   * Get overall metrics
   */
  getMetrics(): AnalyticsMetrics {
    const total = this.caseData.length;
    const signed = this.caseData.filter((c) => c.status === "signed").length;
    const lost = this.caseData.filter((c) => c.status === "lost").length;
    const totalRevenue = this.caseData
      .filter((c) => c.status === "signed")
      .reduce((sum, c) => sum + c.value, 0);
    const avgResponseTime =
      this.caseData.reduce((sum, c) => sum + c.responseTime, 0) / total || 0;

    return {
      totalCases: total,
      signedCases: signed,
      conversionRate: total > 0 ? (signed / total) * 100 : 0,
      avgResponseTime,
      avgCaseValue: total > 0 ? totalRevenue / total : 0,
      totalRevenue,
      roi: totalRevenue > 0 ? (totalRevenue / (total * 100)) * 100 : 0,
      churnRate: total > 0 ? (lost / total) * 100 : 0,
    };
  }

  /**
   * Get trend analysis
   */
  getTrendAnalysis(days: number = 30): Array<{
    date: string;
    cases: number;
    signed: number;
    revenue: number;
  }> {
    const trends: Map<string, { cases: number; signed: number; revenue: number }> = new Map();
    const now = Date.now();

    this.caseData.forEach((c) => {
      if (c.createdAt >= now - days * 24 * 60 * 60 * 1000) {
        const date = new Date(c.createdAt).toISOString().split("T")[0];

        if (!trends.has(date)) {
          trends.set(date, { cases: 0, signed: 0, revenue: 0 });
        }

        const trend = trends.get(date)!;
        trend.cases += 1;
        if (c.status === "signed") {
          trend.signed += 1;
          trend.revenue += c.value;
        }
      }
    });

    return Array.from(trends.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const analyticsEngine = new AnalyticsEngine();
