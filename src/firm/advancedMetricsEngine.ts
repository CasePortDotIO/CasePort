export interface CustomerMetrics {
  customerId: string;
  totalCases: number;
  totalRevenue: number;
  acquisitionCost: number;
  lifetimeValue: number;
  paybackPeriod: number; // in days
  avgCaseValue: number;
  retentionRate: number;
  churnRisk: "low" | "medium" | "high";
}

export interface CohortMetrics {
  cohortId: string;
  month: string;
  acquisitionCost: number;
  month1Revenue: number;
  month3Revenue: number;
  month6Revenue: number;
  month12Revenue: number;
  ltv: number;
  roi: number;
}

export interface SegmentAnalysis {
  segment: string;
  size: number;
  avgLTV: number;
  avgCAC: number;
  roi: number;
  growth: number;
}

export class AdvancedMetricsEngine {
  private customers: Map<
    string,
    {
      id: string;
      acquisitionCost: number;
      cases: Array<{ date: number; value: number }>;
      createdAt: number;
      lastActive: number;
    }
  > = new Map();

  /**
   * Track customer acquisition
   */
  trackCustomer(
    customerId: string,
    acquisitionCost: number,
    createdAt: number = Date.now()
  ): void {
    if (!this.customers.has(customerId)) {
      this.customers.set(customerId, {
        id: customerId,
        acquisitionCost,
        cases: [],
        createdAt,
        lastActive: createdAt,
      });
    }
  }

  /**
   * Record case revenue for customer
   */
  recordCaseRevenue(customerId: string, value: number, date: number = Date.now()): void {
    const customer = this.customers.get(customerId);
    if (customer) {
      customer.cases.push({ date, value });
      customer.lastActive = date;
    }
  }

  /**
   * Calculate customer lifetime value
   */
  calculateLTV(customerId: string): number {
    const customer = this.customers.get(customerId);
    if (!customer) return 0;

    const totalRevenue = customer.cases.reduce((sum, c) => sum + c.value, 0);
    const daysSinceAcquisition = (Date.now() - customer.createdAt) / (1000 * 60 * 60 * 24);
    const avgDailyRevenue = daysSinceAcquisition > 0 ? totalRevenue / daysSinceAcquisition : 0;

    // Project LTV based on 365-day horizon
    const projectedLTV = avgDailyRevenue * 365;
    return Math.max(totalRevenue, projectedLTV);
  }

  /**
   * Calculate customer acquisition cost
   */
  getCAC(customerId: string): number {
    return this.customers.get(customerId)?.acquisitionCost || 0;
  }

  /**
   * Calculate payback period
   */
  calculatePaybackPeriod(customerId: string): number {
    const customer = this.customers.get(customerId);
    if (!customer) return 0;

    const cac = customer.acquisitionCost;
    let cumulativeRevenue = 0;

    for (const caseData of customer.cases) {
      cumulativeRevenue += caseData.value;
      if (cumulativeRevenue >= cac) {
        const daysSinceAcquisition = (caseData.date - customer.createdAt) / (1000 * 60 * 60 * 24);
        return daysSinceAcquisition;
      }
    }

    return 0; // Not yet paid back
  }

  /**
   * Get customer metrics
   */
  getCustomerMetrics(customerId: string): CustomerMetrics {
    const customer = this.customers.get(customerId);
    if (!customer) {
      return {
        customerId,
        totalCases: 0,
        totalRevenue: 0,
        acquisitionCost: 0,
        lifetimeValue: 0,
        paybackPeriod: 0,
        avgCaseValue: 0,
        retentionRate: 0,
        churnRisk: "low",
      };
    }

    const totalRevenue = customer.cases.reduce((sum, c) => sum + c.value, 0);
    const ltv = this.calculateLTV(customerId);
    const cac = customer.acquisitionCost;
    const paybackPeriod = this.calculatePaybackPeriod(customerId);
    const daysSinceLastActive = (Date.now() - customer.lastActive) / (1000 * 60 * 60 * 24);

    // Determine churn risk
    let churnRisk: "low" | "medium" | "high" = "low";
    if (daysSinceLastActive > 90) churnRisk = "high";
    else if (daysSinceLastActive > 30) churnRisk = "medium";

    return {
      customerId,
      totalCases: customer.cases.length,
      totalRevenue,
      acquisitionCost: cac,
      lifetimeValue: ltv,
      paybackPeriod,
      avgCaseValue: customer.cases.length > 0 ? totalRevenue / customer.cases.length : 0,
      retentionRate: ltv > 0 ? (totalRevenue / ltv) * 100 : 0,
      churnRisk,
    };
  }

  /**
   * Get cohort analysis with LTV
   */
  getCohortMetrics(): CohortMetrics[] {
    const cohorts: Map<string, CohortMetrics> = new Map();

    this.customers.forEach((customer) => {
      const month = new Date(customer.createdAt).toISOString().slice(0, 7);
      const cohortId = `cohort_${month}`;

      if (!cohorts.has(cohortId)) {
        cohorts.set(cohortId, {
          cohortId,
          month,
          acquisitionCost: 0,
          month1Revenue: 0,
          month3Revenue: 0,
          month6Revenue: 0,
          month12Revenue: 0,
          ltv: 0,
          roi: 0,
        });
      }

      const cohort = cohorts.get(cohortId)!;
      cohort.acquisitionCost += customer.acquisitionCost;

      const monthSinceAcquisition = Math.floor(
        (Date.now() - customer.createdAt) / (1000 * 60 * 60 * 24 * 30)
      );

      customer.cases.forEach((caseData) => {
        const caseMonthsSinceAcquisition = Math.floor(
          (caseData.date - customer.createdAt) / (1000 * 60 * 60 * 24 * 30)
        );

        if (caseMonthsSinceAcquisition <= 1) cohort.month1Revenue += caseData.value;
        if (caseMonthsSinceAcquisition <= 3) cohort.month3Revenue += caseData.value;
        if (caseMonthsSinceAcquisition <= 6) cohort.month6Revenue += caseData.value;
        if (caseMonthsSinceAcquisition <= 12) cohort.month12Revenue += caseData.value;
      });

      cohort.ltv = this.calculateLTV(customer.id);
      cohort.roi =
        cohort.acquisitionCost > 0
          ? ((cohort.month12Revenue - cohort.acquisitionCost) / cohort.acquisitionCost) * 100
          : 0;
    });

    return Array.from(cohorts.values());
  }

  /**
   * Segment analysis
   */
  getSegmentAnalysis(): SegmentAnalysis[] {
    const segments: Map<string, SegmentAnalysis> = new Map();

    this.customers.forEach((customer) => {
      const segment =
        customer.cases.length === 0
          ? "inactive"
          : customer.cases.length < 5
            ? "low-value"
            : customer.cases.length < 20
              ? "mid-value"
              : "high-value";

      if (!segments.has(segment)) {
        segments.set(segment, {
          segment,
          size: 0,
          avgLTV: 0,
          avgCAC: 0,
          roi: 0,
          growth: 0,
        });
      }

      const seg = segments.get(segment)!;
      seg.size += 1;
      seg.avgLTV += this.calculateLTV(customer.id);
      seg.avgCAC += customer.acquisitionCost;
    });

    // Calculate averages
    segments.forEach((seg) => {
      seg.avgLTV = seg.avgLTV / seg.size;
      seg.avgCAC = seg.avgCAC / seg.size;
      seg.roi = seg.avgCAC > 0 ? ((seg.avgLTV - seg.avgCAC) / seg.avgCAC) * 100 : 0;
    });

    return Array.from(segments.values());
  }

  /**
   * Get high-risk customers (churn risk)
   */
  getAtRiskCustomers(): CustomerMetrics[] {
    const atRisk: CustomerMetrics[] = [];

    this.customers.forEach((customer) => {
      const metrics = this.getCustomerMetrics(customer.id);
      if (metrics.churnRisk === "high" || metrics.churnRisk === "medium") {
        atRisk.push(metrics);
      }
    });

    return atRisk.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  }

  /**
   * Get portfolio summary
   */
  getPortfolioSummary() {
    let totalLTV = 0;
    let totalCAC = 0;
    let totalRevenue = 0;
    let customerCount = this.customers.size;

    this.customers.forEach((customer) => {
      totalLTV += this.calculateLTV(customer.id);
      totalCAC += customer.acquisitionCost;
      totalRevenue += customer.cases.reduce((sum, c) => sum + c.value, 0);
    });

    return {
      totalCustomers: customerCount,
      totalLTV,
      totalCAC,
      totalRevenue,
      avgLTV: customerCount > 0 ? totalLTV / customerCount : 0,
      avgCAC: customerCount > 0 ? totalCAC / customerCount : 0,
      portfolioROI: totalCAC > 0 ? ((totalRevenue - totalCAC) / totalCAC) * 100 : 0,
      ltvCacRatio: totalCAC > 0 ? totalLTV / totalCAC : 0,
    };
  }
}

export const advancedMetricsEngine = new AdvancedMetricsEngine();
