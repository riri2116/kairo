-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "WorkspacePlan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "ProductStage" AS ENUM ('IDEA', 'DISCOVERY', 'DEVELOPMENT', 'BETA', 'LAUNCHED', 'SCALING');

-- CreateEnum
CREATE TYPE "SimulationStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SandboxStatus" AS ENUM ('DRAFT', 'SIMULATING', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PredictionType" AS ENUM ('USER_GROWTH', 'REVENUE', 'RETENTION', 'CHURN', 'ENGAGEMENT', 'MARKET_FIT');

-- CreateEnum
CREATE TYPE "PredictionHorizon" AS ENUM ('THIRTY_DAYS', 'NINETY_DAYS', 'ONE_YEAR', 'THREE_YEARS');

-- CreateEnum
CREATE TYPE "RoadmapStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RoadmapItemStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RequirementType" AS ENUM ('FEATURE', 'BUG_FIX', 'IMPROVEMENT', 'TECHNICAL_DEBT', 'RESEARCH');

-- CreateEnum
CREATE TYPE "RequirementStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SIMULATION_COMPLETE', 'PREDICTION_UPDATED', 'BOARDROOM_READY', 'COMPETITOR_ALERT', 'TEAM_INVITATION', 'SYSTEM');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "plan" "WorkspacePlan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT,
    "stage" "ProductStage" NOT NULL DEFAULT 'IDEA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "status" "SimulationStatus" NOT NULL DEFAULT 'PENDING',
    "confidence" DOUBLE PRECISION,
    "retentionImpact" DOUBLE PRECISION,
    "riskScore" "RiskLevel",
    "result" JSONB,
    "runAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boardroom_sessions" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "topic" TEXT NOT NULL,
    "summary" TEXT,
    "consensus" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
    "votes" JSONB,
    "transcript" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "boardroom_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_analyses" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "competitorName" TEXT NOT NULL,
    "competitorUrl" TEXT,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "opportunities" TEXT[],
    "threats" TEXT[],
    "score" INTEGER,
    "rawData" JSONB,
    "analyzedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "competitor_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_sandboxes" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "featureName" TEXT NOT NULL,
    "description" TEXT,
    "retentionImpact" DOUBLE PRECISION,
    "revenueImpact" DOUBLE PRECISION,
    "engagementImpact" DOUBLE PRECISION,
    "effortEstimateDays" INTEGER,
    "riskLevel" "RiskLevel",
    "status" "SandboxStatus" NOT NULL DEFAULT 'DRAFT',
    "parameters" JSONB,
    "results" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "feature_sandboxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "type" "PredictionType" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "horizon" "PredictionHorizon" NOT NULL,
    "predictedValue" JSONB,
    "actualValue" JSONB,
    "accuracy" DOUBLE PRECISION,
    "metadata" JSONB,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmaps" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quarter" TEXT,
    "status" "RoadmapStatus" NOT NULL DEFAULT 'DRAFT',
    "goals" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_items" (
    "id" UUID NOT NULL,
    "roadmapId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "RoadmapItemStatus" NOT NULL DEFAULT 'PLANNED',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "roadmap_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_requirements" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "RequirementType" NOT NULL DEFAULT 'FEATURE',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "RequirementStatus" NOT NULL DEFAULT 'DRAFT',
    "acceptanceCriteria" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "workspaceId" UUID,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "actionUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspaces_slug_idx" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspaces_deletedAt_idx" ON "workspaces"("deletedAt");

-- CreateIndex
CREATE INDEX "workspace_members_workspaceId_idx" ON "workspace_members"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_members_userId_idx" ON "workspace_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_userId_workspaceId_key" ON "workspace_members"("userId", "workspaceId");

-- CreateIndex
CREATE INDEX "products_workspaceId_idx" ON "products"("workspaceId");

-- CreateIndex
CREATE INDEX "products_stage_idx" ON "products"("stage");

-- CreateIndex
CREATE INDEX "products_deletedAt_idx" ON "products"("deletedAt");

-- CreateIndex
CREATE INDEX "simulations_productId_idx" ON "simulations"("productId");

-- CreateIndex
CREATE INDEX "simulations_status_idx" ON "simulations"("status");

-- CreateIndex
CREATE INDEX "simulations_deletedAt_idx" ON "simulations"("deletedAt");

-- CreateIndex
CREATE INDEX "boardroom_sessions_productId_idx" ON "boardroom_sessions"("productId");

-- CreateIndex
CREATE INDEX "boardroom_sessions_status_idx" ON "boardroom_sessions"("status");

-- CreateIndex
CREATE INDEX "boardroom_sessions_deletedAt_idx" ON "boardroom_sessions"("deletedAt");

-- CreateIndex
CREATE INDEX "competitor_analyses_productId_idx" ON "competitor_analyses"("productId");

-- CreateIndex
CREATE INDEX "competitor_analyses_deletedAt_idx" ON "competitor_analyses"("deletedAt");

-- CreateIndex
CREATE INDEX "feature_sandboxes_productId_idx" ON "feature_sandboxes"("productId");

-- CreateIndex
CREATE INDEX "feature_sandboxes_status_idx" ON "feature_sandboxes"("status");

-- CreateIndex
CREATE INDEX "feature_sandboxes_deletedAt_idx" ON "feature_sandboxes"("deletedAt");

-- CreateIndex
CREATE INDEX "predictions_productId_idx" ON "predictions"("productId");

-- CreateIndex
CREATE INDEX "predictions_type_idx" ON "predictions"("type");

-- CreateIndex
CREATE INDEX "predictions_horizon_idx" ON "predictions"("horizon");

-- CreateIndex
CREATE INDEX "predictions_deletedAt_idx" ON "predictions"("deletedAt");

-- CreateIndex
CREATE INDEX "roadmaps_productId_idx" ON "roadmaps"("productId");

-- CreateIndex
CREATE INDEX "roadmaps_status_idx" ON "roadmaps"("status");

-- CreateIndex
CREATE INDEX "roadmaps_deletedAt_idx" ON "roadmaps"("deletedAt");

-- CreateIndex
CREATE INDEX "roadmap_items_roadmapId_idx" ON "roadmap_items"("roadmapId");

-- CreateIndex
CREATE INDEX "roadmap_items_priority_idx" ON "roadmap_items"("priority");

-- CreateIndex
CREATE INDEX "roadmap_items_status_idx" ON "roadmap_items"("status");

-- CreateIndex
CREATE INDEX "roadmap_items_deletedAt_idx" ON "roadmap_items"("deletedAt");

-- CreateIndex
CREATE INDEX "product_requirements_productId_idx" ON "product_requirements"("productId");

-- CreateIndex
CREATE INDEX "product_requirements_type_idx" ON "product_requirements"("type");

-- CreateIndex
CREATE INDEX "product_requirements_priority_idx" ON "product_requirements"("priority");

-- CreateIndex
CREATE INDEX "product_requirements_status_idx" ON "product_requirements"("status");

-- CreateIndex
CREATE INDEX "product_requirements_deletedAt_idx" ON "product_requirements"("deletedAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "notifications_workspaceId_idx" ON "notifications"("workspaceId");

-- CreateIndex
CREATE INDEX "notifications_deletedAt_idx" ON "notifications"("deletedAt");

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boardroom_sessions" ADD CONSTRAINT "boardroom_sessions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_analyses" ADD CONSTRAINT "competitor_analyses_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_sandboxes" ADD CONSTRAINT "feature_sandboxes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_items" ADD CONSTRAINT "roadmap_items_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_requirements" ADD CONSTRAINT "product_requirements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
