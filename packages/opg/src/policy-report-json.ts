/**
 * Type definitions for the policy analysis report.
 *
 * Contract between the generator and the web app.
 * The generated .ts file uses `satisfies PolicyReportJSON` for compile-time validation.
 */

export interface PolicyReportPolicy {
  name: string;
  type: string;
  category: string;
  description: string;
  recommendationType: string;
  evidenceGrade: string;
  causalConfidenceScore: number;
  policyImpactScore: number;
  welfareScore: number;
  incomeEffect: number;
  healthEffect: number;
  bradfordHillScores: Record<string, number>;
  rationale: string;
  currentStatus: string;
  recommendedTarget: string;
  blockingFactors: string[];
}

export interface NaturalExperimentOutcome {
  metric: string;
  unit: string;
  direction: string;
  yearRange: string;
  totalDataPoints: number;
  preDataPoints: number;
  postDataPoints: number;
  preMean: number;
  preSlope: number;
  postMean: number;
  postSlope: number;
  absoluteChange: number;
  percentChange: number;
  directionCorrect: boolean;
  correlation: number;
  pValue: number;
  bradfordHillAverage: number;
  predictorImpactScore: number;
  effectSizePercent: number;
  prePostCorrelation: number;
  interpretation: string;
}

export interface NaturalExperiment {
  policy: string;
  jurisdiction: string;
  jurisdictionCode: string;
  interventionYear: number;
  description: string;
  outcomes: NaturalExperimentOutcome[];
}

export interface PolicyReportJSON {
  jurisdiction: string;
  policies: PolicyReportPolicy[];
  generatedAt: string;
  generatedBy?: string;
  note?: string;
  /** Real-world natural experiments with before/after outcomes */
  naturalExperiments?: NaturalExperiment[];
}
