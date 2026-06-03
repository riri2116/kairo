-- CreateEnum
CREATE TYPE "JourneyType" AS ENUM ('ONBOARDING', 'CHECKOUT', 'FEATURE_DISCOVERY', 'SUBSCRIPTION_UPGRADE', 'PRODUCT_ACTIVATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "EmotionType" AS ENUM ('EXCITED', 'CURIOUS', 'CONFIDENT', 'CONFUSED', 'FRUSTRATED', 'OVERWHELMED', 'DELIGHTED');

-- CreateEnum
CREATE TYPE "OptimizationCategory" AS ENUM ('SIMPLIFICATION', 'ONBOARDING', 'GUIDANCE', 'FLOW_IMPROVEMENT');

-- CreateTable
CREATE TABLE "journeys" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "productId" UUID,
    "name" TEXT NOT NULL,
    "type" "JourneyType" NOT NULL DEFAULT 'CUSTOM',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_steps" (
    "id" UUID NOT NULL,
    "journeyId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emotion_analyses" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "journeyId" UUID NOT NULL,
    "productId" UUID,
    "status" "SimulationStatus" NOT NULL DEFAULT 'PENDING',
    "avgFrictionScore" DOUBLE PRECISION,
    "dropOffRisk" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION,
    "delightScore" DOUBLE PRECISION,
    "activationPotential" DOUBLE PRECISION,
    "overallRisk" "RiskLevel",
    "summary" TEXT,
    "timeline" JSONB,
    "optimizedJourney" JSONB,
    "rawResponse" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "emotion_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ux_risks" (
    "id" UUID NOT NULL,
    "analysisId" UUID NOT NULL,
    "area" TEXT NOT NULL,
    "level" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "stepReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ux_risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "optimization_suggestions" (
    "id" UUID NOT NULL,
    "analysisId" UUID NOT NULL,
    "category" "OptimizationCategory" NOT NULL DEFAULT 'FLOW_IMPROVEMENT',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expectedImpact" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "optimization_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "journeys_workspaceId_idx" ON "journeys"("workspaceId");

-- CreateIndex
CREATE INDEX "journeys_productId_idx" ON "journeys"("productId");

-- CreateIndex
CREATE INDEX "journeys_type_idx" ON "journeys"("type");

-- CreateIndex
CREATE INDEX "journeys_deletedAt_idx" ON "journeys"("deletedAt");

-- CreateIndex
CREATE INDEX "journey_steps_journeyId_idx" ON "journey_steps"("journeyId");

-- CreateIndex
CREATE INDEX "emotion_analyses_workspaceId_idx" ON "emotion_analyses"("workspaceId");

-- CreateIndex
CREATE INDEX "emotion_analyses_journeyId_idx" ON "emotion_analyses"("journeyId");

-- CreateIndex
CREATE INDEX "emotion_analyses_productId_idx" ON "emotion_analyses"("productId");

-- CreateIndex
CREATE INDEX "emotion_analyses_status_idx" ON "emotion_analyses"("status");

-- CreateIndex
CREATE INDEX "emotion_analyses_deletedAt_idx" ON "emotion_analyses"("deletedAt");

-- CreateIndex
CREATE INDEX "ux_risks_analysisId_idx" ON "ux_risks"("analysisId");

-- CreateIndex
CREATE INDEX "ux_risks_level_idx" ON "ux_risks"("level");

-- CreateIndex
CREATE INDEX "optimization_suggestions_analysisId_idx" ON "optimization_suggestions"("analysisId");

-- CreateIndex
CREATE INDEX "optimization_suggestions_category_idx" ON "optimization_suggestions"("category");

-- AddForeignKey
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_steps" ADD CONSTRAINT "journey_steps_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emotion_analyses" ADD CONSTRAINT "emotion_analyses_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emotion_analyses" ADD CONSTRAINT "emotion_analyses_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emotion_analyses" ADD CONSTRAINT "emotion_analyses_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ux_risks" ADD CONSTRAINT "ux_risks_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "emotion_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optimization_suggestions" ADD CONSTRAINT "optimization_suggestions_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "emotion_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
