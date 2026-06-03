import type {
  User,
  Workspace,
  WorkspaceMember,
  Product,
  Simulation,
  BoardroomSession,
  CompetitorAnalysis,
  FeatureSandbox,
  Prediction,
  Roadmap,
  RoadmapItem,
  ProductRequirement,
  Notification,
  WorkspaceRole,
  WorkspacePlan,
  ProductStage,
  SimulationStatus,
  RiskLevel,
  SessionStatus,
  SandboxStatus,
  PredictionType,
  PredictionHorizon,
  RoadmapStatus,
  RoadmapItemStatus,
  Priority,
  RequirementType,
  RequirementStatus,
  NotificationType,
} from "@prisma/client";

// Re-export all Prisma types
export type {
  User,
  Workspace,
  WorkspaceMember,
  Product,
  Simulation,
  BoardroomSession,
  CompetitorAnalysis,
  FeatureSandbox,
  Prediction,
  Roadmap,
  RoadmapItem,
  ProductRequirement,
  Notification,
  WorkspaceRole,
  WorkspacePlan,
  ProductStage,
  SimulationStatus,
  RiskLevel,
  SessionStatus,
  SandboxStatus,
  PredictionType,
  PredictionHorizon,
  RoadmapStatus,
  RoadmapItemStatus,
  Priority,
  RequirementType,
  RequirementStatus,
  NotificationType,
};

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── Workspace with member context ───────────────────────────────────────────

export type WorkspaceWithRole = Workspace & {
  role: WorkspaceRole;
  memberCount: number;
};

// ─── Product with summary counts ──────────────────────────────────────────────

export type ProductSummary = Product & {
  _count: {
    simulations: number;
    predictions: number;
    boardroomSessions: number;
    competitorAnalyses: number;
    requirements: number;
  };
};

// ─── Simulation result shape ──────────────────────────────────────────────────

export interface SimulationResult {
  confidence: number;
  retentionImpact: number;
  riskScore: RiskLevel;
  recommendation: string;
  insights: string[];
  predictedMetrics: {
    mauDelta: number;
    revenueDeltaMrr: number;
    npsImpact: number;
  };
}

// ─── Boardroom transcript ─────────────────────────────────────────────────────

export interface BoardroomEntry {
  persona: string;
  role: string;
  stance: "CHAMPION" | "CAUTIOUS" | "NEUTRAL";
  quote: string;
}

export interface BoardroomVotes {
  champion: number;
  cautious: number;
  neutral: number;
}

// ─── Competitor analysis shape ────────────────────────────────────────────────

export interface CompetitorRawData {
  websiteSnapshot?: string;
  pricingModel?: string;
  features?: string[];
  marketPosition?: string;
  lastFundingRound?: string;
}

// ─── Prediction value shapes ──────────────────────────────────────────────────

export interface PredictionValue {
  value: number;
  unit: string;
  lowerBound?: number;
  upperBound?: number;
}
