-- DropForeignKey
ALTER TABLE "boardroom_sessions" DROP CONSTRAINT "boardroom_sessions_productId_fkey";

-- DropForeignKey
ALTER TABLE "competitor_analyses" DROP CONSTRAINT "competitor_analyses_productId_fkey";

-- DropForeignKey
ALTER TABLE "feature_sandboxes" DROP CONSTRAINT "feature_sandboxes_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_requirements" DROP CONSTRAINT "product_requirements_productId_fkey";

-- DropForeignKey
ALTER TABLE "roadmaps" DROP CONSTRAINT "roadmaps_productId_fkey";

-- AlterTable
ALTER TABLE "boardroom_sessions" ADD COLUMN     "workspaceId" UUID,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "competitor_analyses" ADD COLUMN     "workspaceId" UUID,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "feature_sandboxes" ADD COLUMN     "workspaceId" UUID,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_requirements" ADD COLUMN     "workspaceId" UUID,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "roadmaps" ADD COLUMN     "workspaceId" UUID,
ALTER COLUMN "productId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "boardroom_sessions_workspaceId_idx" ON "boardroom_sessions"("workspaceId");

-- CreateIndex
CREATE INDEX "competitor_analyses_workspaceId_idx" ON "competitor_analyses"("workspaceId");

-- CreateIndex
CREATE INDEX "feature_sandboxes_workspaceId_idx" ON "feature_sandboxes"("workspaceId");

-- CreateIndex
CREATE INDEX "product_requirements_workspaceId_idx" ON "product_requirements"("workspaceId");

-- CreateIndex
CREATE INDEX "roadmaps_workspaceId_idx" ON "roadmaps"("workspaceId");

-- AddForeignKey
ALTER TABLE "boardroom_sessions" ADD CONSTRAINT "boardroom_sessions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boardroom_sessions" ADD CONSTRAINT "boardroom_sessions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_analyses" ADD CONSTRAINT "competitor_analyses_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_analyses" ADD CONSTRAINT "competitor_analyses_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_sandboxes" ADD CONSTRAINT "feature_sandboxes_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_sandboxes" ADD CONSTRAINT "feature_sandboxes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_requirements" ADD CONSTRAINT "product_requirements_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_requirements" ADD CONSTRAINT "product_requirements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
