export interface Prediction {
  id: string;
  type: "churn" | "conversion" | "value" | "response_time" | "anomaly";
  resourceId: string;
  probability: number; // 0-1
  confidence: number; // 0-1
  prediction: string;
  reasoning: string[];
  recommendedAction: string;
  timestamp: number;
}

export interface AnomalyAlert {
  id: string;
  type: "unusual_activity" | "performance_drop" | "spike" | "pattern_change";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affectedMetric: string;
  baselineValue: number;
  currentValue: number;
  deviation: number; // percentage
  timestamp: number;
}

export class PredictiveAnalyticsEngine {
  private predictions: Map<string, Prediction[]> = new Map();
  private anomalies: AnomalyAlert[] = [];
  private historicalData: Map<string, number[]> = new Map();
  private storageKey = "caseport_predictions";

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Predict churn risk
   */
  predictChurnRisk(
    resourceId: string,
    lastActivityDays: number,
    conversionRate: number,
    avgCaseValue: number
  ): Prediction {
    let probability = 0;
    const reasoning: string[] = [];

    // Factor 1: Inactivity (weight: 40%)
    if (lastActivityDays > 60) {
      probability += 0.4;
      reasoning.push(`No activity for ${lastActivityDays} days`);
    } else if (lastActivityDays > 30) {
      probability += 0.2;
      reasoning.push(`Limited activity (${lastActivityDays} days)`);
    }

    // Factor 2: Low conversion rate (weight: 35%)
    if (conversionRate < 0.05) {
      probability += 0.35;
      reasoning.push("Very low conversion rate (<5%)");
    } else if (conversionRate < 0.1) {
      probability += 0.2;
      reasoning.push("Low conversion rate (<10%)");
    }

    // Factor 3: Low case value (weight: 25%)
    if (avgCaseValue < 10000) {
      probability += 0.15;
      reasoning.push("Low average case value");
    } else if (avgCaseValue < 25000) {
      probability += 0.1;
      reasoning.push("Below-average case value");
    }

    const prediction: Prediction = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "churn",
      resourceId,
      probability: Math.min(probability, 1),
      confidence: 0.75 + Math.random() * 0.2,
      prediction: probability > 0.6 ? "High churn risk" : probability > 0.3 ? "Medium churn risk" : "Low churn risk",
      reasoning,
      recommendedAction:
        probability > 0.6
          ? "Immediate outreach and incentive program recommended"
          : "Monitor engagement closely",
      timestamp: Date.now(),
    };

    this.storePrediction(resourceId, prediction);
    return prediction;
  }

  /**
   * Predict conversion probability
   */
  predictConversionProbability(
    resourceId: string,
    responseTime: number,
    caseType: string,
    market: string,
    daysOpen: number
  ): Prediction {
    let probability = 0.5; // Base probability
    const reasoning: string[] = [];

    // Factor 1: Response time (weight: 40%)
    if (responseTime < 15) {
      probability += 0.25;
      reasoning.push("Fast response time (<15 min)");
    } else if (responseTime < 60) {
      probability += 0.1;
      reasoning.push("Good response time (<1 hour)");
    } else if (responseTime > 240) {
      probability -= 0.15;
      reasoning.push("Slow response time (>4 hours)");
    }

    // Factor 2: Case age (weight: 35%)
    if (daysOpen < 7) {
      probability += 0.15;
      reasoning.push("Fresh case (< 7 days)");
    } else if (daysOpen > 30) {
      probability -= 0.2;
      reasoning.push("Aged case (> 30 days)");
    }

    // Factor 3: Market conditions (weight: 25%)
    const marketMultiplier = market === "Houston" ? 1.1 : market === "Dallas" ? 1.05 : 0.95;
    probability *= marketMultiplier;

    const prediction: Prediction = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "conversion",
      resourceId,
      probability: Math.max(0, Math.min(probability, 1)),
      confidence: 0.7 + Math.random() * 0.25,
      prediction:
        probability > 0.7
          ? "High conversion probability"
          : probability > 0.4
            ? "Medium conversion probability"
            : "Low conversion probability",
      reasoning,
      recommendedAction:
        probability > 0.7
          ? "Prioritize follow-up and case preparation"
          : "Consider additional outreach",
      timestamp: Date.now(),
    };

    this.storePrediction(resourceId, prediction);
    return prediction;
  }

  /**
   * Predict case value
   */
  predictCaseValue(
    resourceId: string,
    caseType: string,
    market: string,
    injuryType: string
  ): Prediction {
    let baseValue = 50000;
    const reasoning: string[] = [];

    // Adjust by case type
    const caseTypeMultipliers: Record<string, number> = {
      "Auto Accident": 1.0,
      "Slip & Fall": 0.8,
      "Medical Malpractice": 2.5,
      "Product Liability": 1.8,
      "Premises Liability": 0.9,
    };

    const typeMultiplier = caseTypeMultipliers[caseType] || 1.0;
    baseValue *= typeMultiplier;
    reasoning.push(`Case type: ${caseType}`);

    // Adjust by market
    const marketMultipliers: Record<string, number> = {
      Houston: 1.15,
      Dallas: 1.1,
      Austin: 1.05,
    };

    const marketMultiplier = marketMultipliers[market] || 1.0;
    baseValue *= marketMultiplier;
    reasoning.push(`Market: ${market}`);

    // Add variance
    const variance = (Math.random() - 0.5) * 0.3;
    const predictedValue = baseValue * (1 + variance);

    const prediction: Prediction = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "value",
      resourceId,
      probability: predictedValue,
      confidence: 0.65 + Math.random() * 0.3,
      prediction: `Estimated case value: $${Math.round(predictedValue).toLocaleString()}`,
      reasoning,
      recommendedAction: "Use for portfolio planning and resource allocation",
      timestamp: Date.now(),
    };

    this.storePrediction(resourceId, prediction);
    return prediction;
  }

  /**
   * Detect anomalies
   */
  detectAnomalies(metricName: string, currentValue: number): AnomalyAlert | undefined {
    const history = this.historicalData.get(metricName) || [];
    history.push(currentValue);

    if (history.length < 10) {
      this.historicalData.set(metricName, history);
      return undefined;
    }

    // Calculate baseline (mean of last 10 values)
    const baseline = history.slice(-10).reduce((a, b) => a + b, 0) / 10;
    const stdDev = Math.sqrt(
      history
        .slice(-10)
        .reduce((sum, val) => sum + Math.pow(val - baseline, 2), 0) / 10
    );

    const zScore = Math.abs((currentValue - baseline) / (stdDev || 1));
    const deviation = ((currentValue - baseline) / baseline) * 100;

    if (zScore > 2.5) {
      let alertType: AnomalyAlert["type"] = "unusual_activity";
      let severity: AnomalyAlert["severity"] = "medium";

      if (deviation > 50) {
        alertType = "spike";
        severity = zScore > 3.5 ? "critical" : "high";
      } else if (deviation < -30) {
        alertType = "performance_drop";
        severity = zScore > 3.5 ? "high" : "medium";
      }

      const alert: AnomalyAlert = {
        id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: alertType,
        severity,
        description: `Anomaly detected in ${metricName}`,
        affectedMetric: metricName,
        baselineValue: baseline,
        currentValue,
        deviation,
        timestamp: Date.now(),
      };

      this.anomalies.unshift(alert);
      if (this.anomalies.length > 100) {
        this.anomalies = this.anomalies.slice(0, 100);
      }

      this.saveToStorage();
      return alert;
    }

    this.historicalData.set(metricName, history.slice(-20)); // Keep last 20 values
    return undefined;
  }

  /**
   * Store prediction
   */
  private storePrediction(resourceId: string, prediction: Prediction): void {
    if (!this.predictions.has(resourceId)) {
      this.predictions.set(resourceId, []);
    }
    this.predictions.get(resourceId)!.unshift(prediction);

    // Keep last 50 predictions per resource
    const predictions = this.predictions.get(resourceId)!;
    if (predictions.length > 50) {
      this.predictions.set(resourceId, predictions.slice(0, 50));
    }

    this.saveToStorage();
  }

  /**
   * Get predictions for resource
   */
  getPredictions(resourceId: string): Prediction[] {
    return this.predictions.get(resourceId) || [];
  }

  /**
   * Get recent anomalies
   */
  getRecentAnomalies(limit: number = 20): AnomalyAlert[] {
    return this.anomalies.slice(0, limit);
  }

  /**
   * Get critical anomalies
   */
  getCriticalAnomalies(): AnomalyAlert[] {
    return this.anomalies.filter((a) => a.severity === "critical");
  }

  /**
   * Save to storage
   */
  private saveToStorage(): void {
    try {
      const data = {
        predictions: Array.from(this.predictions.entries()),
        anomalies: this.anomalies,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save predictions:", error);
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
        this.predictions = new Map(data.predictions);
        this.anomalies = data.anomalies || [];
      }
    } catch (error) {
      console.error("Failed to load predictions:", error);
    }
  }
}

export const predictiveAnalyticsEngine = new PredictiveAnalyticsEngine();
