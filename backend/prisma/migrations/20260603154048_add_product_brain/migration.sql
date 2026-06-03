-- CreateEnum
CREATE TYPE "BrainSubmissionType" AS ENUM ('PRODUCT_IDEA', 'FEATURE_IDEA', 'PRICING_CHANGE', 'GROWTH_EXPERIMENT');

-- CreateEnum
CREATE TYPE "BrainStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "product_brain_analyses" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "productId" UUID,
    "submissionType" "BrainSubmissionType" NOT NULL,
    "title" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "status" "BrainStatus" NOT NULL DEFAULT 'PENDING',
    "impactAnalysis" TEXT,
    "riskAssessment" TEXT,
    "technicalComplexity" TEXT,
    "revenueImpact" TEXT,
    "retentionImpact" TEXT,
    "recommendation" TEXT,
    "confidenceScore" DOUBLE PRECISION,
    "riskLevel" "RiskLevel",
    "rawResponse" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_brain_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_brain_analyses_workspaceId_idx" ON "product_brain_analyses"("workspaceId");

-- CreateIndex
CREATE INDEX "product_brain_analyses_productId_idx" ON "product_brain_analyses"("productId");

-- CreateIndex
CREATE INDEX "product_brain_analyses_status_idx" ON "product_brain_analyses"("status");

-- CreateIndex
CREATE INDEX "product_brain_analyses_submissionType_idx" ON "product_brain_analyses"("submissionType");

-- CreateIndex
CREATE INDEX "product_brain_analyses_deletedAt_idx" ON "product_brain_analyses"("deletedAt");

-- AddForeignKey
ALTER TABLE "product_brain_analyses" ADD CONSTRAINT "product_brain_analyses_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_brain_analyses" ADD CONSTRAINT "product_brain_analyses_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
