-- CreateEnum (idempotent — types may already exist from a partial prior run)
DO $$ BEGIN CREATE TYPE "WishReason" AS ENUM ('WORLD_ID_VERIFICATION', 'KYC_COMPLETION', 'CENSUS_SNAPSHOT', 'DAILY_CHECKIN', 'WISHOCRATIC_ALLOCATION', 'REFERENDUM_VOTE', 'ALIGNMENT_CHECK', 'REFERRAL', 'PRIZE_DEPOSIT', 'SHARE_REPORT', 'TASK_COMPLETED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "TaskDifficulty" AS ENUM ('TRIVIAL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "TaskCategory" AS ENUM ('ADVOCACY', 'RESEARCH', 'COMMUNICATION', 'ENGINEERING', 'ORGANIZING', 'OUTREACH', 'GOVERNANCE', 'SCIENCE', 'LEGAL', 'CREATIVE', 'OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "TaskClaimPolicy" AS ENUM ('ASSIGNED_ONLY', 'OPEN_SINGLE', 'OPEN_MANY'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "TaskStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'VERIFIED', 'CANCELLED', 'STALE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "TaskClaimStatus" AS ENUM ('CLAIMED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'REJECTED', 'ABANDONED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "TaskEdgeType" AS ENUM ('DEPENDS_ON', 'BLOCKS', 'INCREASES_PROBABILITY_OF', 'ACCELERATES'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "SourceSystem" AS ENUM ('MANUAL', 'OPG', 'OBG', 'PARAMETER_CATALOG', 'EXTERNAL', 'CURATED', 'COMBINED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "SourceArtifactType" AS ENUM ('MANUAL_SECTION', 'MANUAL_SNAPSHOT', 'OPG_POLICY_RECOMMENDATION', 'OPG_POLICY_REPORT', 'OBG_BUDGET_CATEGORY', 'OBG_BUDGET_REPORT', 'PARAMETER_SET', 'CALCULATION_RUN', 'EXTERNAL_SOURCE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "TaskImpactEstimateKind" AS ENUM ('FORECAST', 'OBSERVED', 'HYBRID'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "TaskImpactPublicationStatus" AS ENUM ('DRAFT', 'REVIEWED', 'PUBLISHED', 'SUPERSEDED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "TaskImpactFrameKey" AS ENUM ('IMMEDIATE', 'ONE_YEAR', 'FIVE_YEAR', 'TWENTY_YEAR', 'LIFETIME', 'CUSTOM'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- DropForeignKey (IF EXISTS for idempotence)
ALTER TABLE IF EXISTS "CategoryAlignmentScore" DROP CONSTRAINT IF EXISTS "CategoryAlignmentScore_alignmentScoreId_fkey";
ALTER TABLE IF EXISTS "CategoryAlignmentScore" DROP CONSTRAINT IF EXISTS "CategoryAlignmentScore_itemId_fkey";
ALTER TABLE IF EXISTS "WishocraticCategorySelection" DROP CONSTRAINT IF EXISTS "WishocraticCategorySelection_itemId_fkey";
ALTER TABLE IF EXISTS "WishocraticCategorySelection" DROP CONSTRAINT IF EXISTS "WishocraticCategorySelection_userId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Item_category_idx";

-- AlterTable
ALTER TABLE "AggregationRun" DROP COLUMN "categoryFilter",
DROP COLUMN "comparisonCount",
ADD COLUMN     "allocationCount" INTEGER NOT NULL,
ADD COLUMN     "itemFilter" TEXT;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availableHoursPerWeek" INTEGER,
ADD COLUMN     "interestTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maxTaskDifficulty" "TaskDifficulty",
ADD COLUMN     "personId" TEXT,
ADD COLUMN     "skillTags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE IF EXISTS "CategoryAlignmentScore";

-- DropTable
DROP TABLE IF EXISTS "WishocraticCategorySelection";

-- CreateTable
CREATE TABLE IF NOT EXISTS "Person" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT,
    "image" TEXT,
    "bio" TEXT,
    "currentAffiliation" TEXT,
    "countryCode" TEXT,
    "isPublicFigure" BOOLEAN NOT NULL DEFAULT false,
    "sourceUrl" TEXT,
    "sourceRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WishocraticItemInclusion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "included" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WishocraticItemInclusion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WishocraticItemAlignmentScore" (
    "id" TEXT NOT NULL,
    "alignmentScoreId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WishocraticItemAlignmentScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Task" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT,
    "parentTaskId" TEXT,
    "assigneePersonId" TEXT,
    "verifiedByUserId" TEXT,
    "currentImpactEstimateSetId" TEXT,
    "taskKey" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impactStatement" TEXT,
    "officeTitle" TEXT,
    "currentAffiliation" TEXT,
    "category" "TaskCategory" NOT NULL DEFAULT 'OTHER',
    "difficulty" "TaskDifficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "estimatedEffortHours" DOUBLE PRECISION,
    "actualEffortSeconds" INTEGER,
    "actualCashCostUsd" DOUBLE PRECISION,
    "skillTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contextJson" JSONB,
    "claimPolicy" "TaskClaimPolicy" NOT NULL DEFAULT 'OPEN_SINGLE',
    "maxClaims" INTEGER,
    "status" "TaskStatus" NOT NULL DEFAULT 'ACTIVE',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "completionEvidence" TEXT,
    "completedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TaskClaim" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verifiedByUserId" TEXT,
    "status" "TaskClaimStatus" NOT NULL DEFAULT 'CLAIMED',
    "completionEvidence" TEXT,
    "verificationNote" TEXT,
    "actualEffortSeconds" INTEGER,
    "actualCashCostUsd" DOUBLE PRECISION,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "abandonedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaskClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "SourceArtifact" (
    "id" TEXT NOT NULL,
    "sourceSystem" "SourceSystem" NOT NULL,
    "artifactType" "SourceArtifactType" NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "externalKey" TEXT,
    "versionKey" TEXT,
    "title" TEXT,
    "sourceUrl" TEXT,
    "sourceRef" TEXT,
    "contentHash" TEXT,
    "payloadJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SourceArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TaskSourceArtifact" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "sourceArtifactId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaskSourceArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TaskEdge" (
    "id" TEXT NOT NULL,
    "fromTaskId" TEXT NOT NULL,
    "toTaskId" TEXT NOT NULL,
    "edgeType" "TaskEdgeType" NOT NULL,
    "probabilityDeltaLow" DOUBLE PRECISION,
    "probabilityDeltaBase" DOUBLE PRECISION,
    "probabilityDeltaHigh" DOUBLE PRECISION,
    "timeDeltaDaysLow" DOUBLE PRECISION,
    "timeDeltaDaysBase" DOUBLE PRECISION,
    "timeDeltaDaysHigh" DOUBLE PRECISION,
    "calculationVersion" TEXT,
    "assumptionsJson" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaskEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TaskImpactEstimateSet" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "estimateKind" "TaskImpactEstimateKind" NOT NULL,
    "publicationStatus" "TaskImpactPublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "sourceSystem" "SourceSystem" NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "methodologyKey" TEXT NOT NULL,
    "parameterSetHash" TEXT NOT NULL,
    "counterfactualKey" TEXT NOT NULL,
    "assumptionsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaskImpactEstimateSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TaskImpactFrameEstimate" (
    "id" TEXT NOT NULL,
    "taskImpactEstimateSetId" TEXT NOT NULL,
    "frameKey" "TaskImpactFrameKey" NOT NULL,
    "frameSlug" TEXT NOT NULL,
    "customFrameLabel" TEXT,
    "evaluationHorizonYears" DOUBLE PRECISION NOT NULL,
    "timeToImpactStartDays" DOUBLE PRECISION NOT NULL,
    "adoptionRampYears" DOUBLE PRECISION NOT NULL,
    "benefitDurationYears" DOUBLE PRECISION NOT NULL,
    "annualDiscountRate" DOUBLE PRECISION NOT NULL,
    "summaryStatsJson" JSONB,
    "successProbabilityLow" DOUBLE PRECISION,
    "successProbabilityBase" DOUBLE PRECISION,
    "successProbabilityHigh" DOUBLE PRECISION,
    "medianIncomeGrowthEffectPpPerYearLow" DOUBLE PRECISION,
    "medianIncomeGrowthEffectPpPerYearBase" DOUBLE PRECISION,
    "medianIncomeGrowthEffectPpPerYearHigh" DOUBLE PRECISION,
    "medianHealthyLifeYearsEffectLow" DOUBLE PRECISION,
    "medianHealthyLifeYearsEffectBase" DOUBLE PRECISION,
    "medianHealthyLifeYearsEffectHigh" DOUBLE PRECISION,
    "expectedDalysAvertedLow" DOUBLE PRECISION,
    "expectedDalysAvertedBase" DOUBLE PRECISION,
    "expectedDalysAvertedHigh" DOUBLE PRECISION,
    "expectedEconomicValueUsdLow" DOUBLE PRECISION,
    "expectedEconomicValueUsdBase" DOUBLE PRECISION,
    "expectedEconomicValueUsdHigh" DOUBLE PRECISION,
    "estimatedCashCostUsdLow" DOUBLE PRECISION,
    "estimatedCashCostUsdBase" DOUBLE PRECISION,
    "estimatedCashCostUsdHigh" DOUBLE PRECISION,
    "estimatedEffortHoursLow" DOUBLE PRECISION,
    "estimatedEffortHoursBase" DOUBLE PRECISION,
    "estimatedEffortHoursHigh" DOUBLE PRECISION,
    "delayDalysLostPerDayLow" DOUBLE PRECISION,
    "delayDalysLostPerDayBase" DOUBLE PRECISION,
    "delayDalysLostPerDayHigh" DOUBLE PRECISION,
    "delayEconomicValueUsdLostPerDayLow" DOUBLE PRECISION,
    "delayEconomicValueUsdLostPerDayBase" DOUBLE PRECISION,
    "delayEconomicValueUsdLostPerDayHigh" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaskImpactFrameEstimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TaskImpactMetric" (
    "id" TEXT NOT NULL,
    "taskImpactFrameEstimateId" TEXT NOT NULL,
    "metricKey" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "lowValue" DOUBLE PRECISION,
    "baseValue" DOUBLE PRECISION,
    "highValue" DOUBLE PRECISION,
    "valueJson" JSONB,
    "summaryStatsJson" JSONB,
    "displayGroup" TEXT,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaskImpactMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TaskImpactSourceArtifact" (
    "id" TEXT NOT NULL,
    "taskImpactEstimateSetId" TEXT NOT NULL,
    "sourceArtifactId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaskImpactSourceArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WishPoint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" "WishReason" NOT NULL,
    "activityId" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Person_email_key" ON "Person"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Person_displayName_idx" ON "Person"("displayName");

CREATE INDEX IF NOT EXISTS "Person_countryCode_idx" ON "Person"("countryCode");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Person_isPublicFigure_idx" ON "Person"("isPublicFigure");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Person_deletedAt_idx" ON "Person"("deletedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishocraticItemInclusion_userId_idx" ON "WishocraticItemInclusion"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishocraticItemInclusion_itemId_idx" ON "WishocraticItemInclusion"("itemId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishocraticItemInclusion_included_idx" ON "WishocraticItemInclusion"("included");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishocraticItemInclusion_createdAt_idx" ON "WishocraticItemInclusion"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishocraticItemInclusion_deletedAt_idx" ON "WishocraticItemInclusion"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "WishocraticItemInclusion_userId_itemId_key" ON "WishocraticItemInclusion"("userId", "itemId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishocraticItemAlignmentScore_alignmentScoreId_idx" ON "WishocraticItemAlignmentScore"("alignmentScoreId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishocraticItemAlignmentScore_itemId_idx" ON "WishocraticItemAlignmentScore"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "WishocraticItemAlignmentScore_alignmentScoreId_itemId_key" ON "WishocraticItemAlignmentScore"("alignmentScoreId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Task_currentImpactEstimateSetId_key" ON "Task"("currentImpactEstimateSetId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Task_taskKey_key" ON "Task"("taskKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_jurisdictionId_status_idx" ON "Task"("jurisdictionId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_parentTaskId_idx" ON "Task"("parentTaskId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_assigneePersonId_idx" ON "Task"("assigneePersonId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_verifiedByUserId_idx" ON "Task"("verifiedByUserId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_currentImpactEstimateSetId_idx" ON "Task"("currentImpactEstimateSetId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_taskKey_idx" ON "Task"("taskKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_claimPolicy_status_idx" ON "Task"("claimPolicy", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_category_idx" ON "Task"("category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_difficulty_idx" ON "Task"("difficulty");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_isPublic_idx" ON "Task"("isPublic");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Task_deletedAt_idx" ON "Task"("deletedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskClaim_taskId_status_idx" ON "TaskClaim"("taskId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskClaim_userId_status_idx" ON "TaskClaim"("userId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskClaim_verifiedByUserId_idx" ON "TaskClaim"("verifiedByUserId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskClaim_deletedAt_idx" ON "TaskClaim"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TaskClaim_taskId_userId_key" ON "TaskClaim"("taskId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SourceArtifact_sourceKey_key" ON "SourceArtifact"("sourceKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SourceArtifact_sourceSystem_artifactType_idx" ON "SourceArtifact"("sourceSystem", "artifactType");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SourceArtifact_externalKey_idx" ON "SourceArtifact"("externalKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SourceArtifact_versionKey_idx" ON "SourceArtifact"("versionKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SourceArtifact_sourceRef_idx" ON "SourceArtifact"("sourceRef");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SourceArtifact_contentHash_idx" ON "SourceArtifact"("contentHash");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SourceArtifact_deletedAt_idx" ON "SourceArtifact"("deletedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskSourceArtifact_taskId_isPrimary_idx" ON "TaskSourceArtifact"("taskId", "isPrimary");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskSourceArtifact_sourceArtifactId_isPrimary_idx" ON "TaskSourceArtifact"("sourceArtifactId", "isPrimary");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskSourceArtifact_deletedAt_idx" ON "TaskSourceArtifact"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TaskSourceArtifact_taskId_sourceArtifactId_key" ON "TaskSourceArtifact"("taskId", "sourceArtifactId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskEdge_fromTaskId_edgeType_idx" ON "TaskEdge"("fromTaskId", "edgeType");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskEdge_toTaskId_edgeType_idx" ON "TaskEdge"("toTaskId", "edgeType");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskEdge_deletedAt_idx" ON "TaskEdge"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TaskEdge_fromTaskId_toTaskId_edgeType_key" ON "TaskEdge"("fromTaskId", "toTaskId", "edgeType");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactEstimateSet_taskId_isCurrent_idx" ON "TaskImpactEstimateSet"("taskId", "isCurrent");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactEstimateSet_publicationStatus_idx" ON "TaskImpactEstimateSet"("publicationStatus");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactEstimateSet_sourceSystem_idx" ON "TaskImpactEstimateSet"("sourceSystem");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactEstimateSet_deletedAt_idx" ON "TaskImpactEstimateSet"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TaskImpactEstimateSet_taskId_estimateKind_sourceSystem_calc_key" ON "TaskImpactEstimateSet"("taskId", "estimateKind", "sourceSystem", "calculationVersion", "methodologyKey", "parameterSetHash", "counterfactualKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactFrameEstimate_taskImpactEstimateSetId_frameKey_idx" ON "TaskImpactFrameEstimate"("taskImpactEstimateSetId", "frameKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactFrameEstimate_deletedAt_idx" ON "TaskImpactFrameEstimate"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TaskImpactFrameEstimate_taskImpactEstimateSetId_frameSlug_key" ON "TaskImpactFrameEstimate"("taskImpactEstimateSetId", "frameSlug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactMetric_metricKey_idx" ON "TaskImpactMetric"("metricKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactMetric_displayGroup_idx" ON "TaskImpactMetric"("displayGroup");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactMetric_deletedAt_idx" ON "TaskImpactMetric"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TaskImpactMetric_taskImpactFrameEstimateId_metricKey_key" ON "TaskImpactMetric"("taskImpactFrameEstimateId", "metricKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactSourceArtifact_taskImpactEstimateSetId_isPrimary_idx" ON "TaskImpactSourceArtifact"("taskImpactEstimateSetId", "isPrimary");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactSourceArtifact_sourceArtifactId_isPrimary_idx" ON "TaskImpactSourceArtifact"("sourceArtifactId", "isPrimary");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TaskImpactSourceArtifact_deletedAt_idx" ON "TaskImpactSourceArtifact"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TaskImpactSourceArtifact_taskImpactEstimateSetId_sourceArti_key" ON "TaskImpactSourceArtifact"("taskImpactEstimateSetId", "sourceArtifactId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishPoint_userId_idx" ON "WishPoint"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishPoint_userId_createdAt_idx" ON "WishPoint"("userId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WishPoint_reason_idx" ON "WishPoint"("reason");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_personId_key" ON "User"("personId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_personId_idx" ON "User"("personId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_availableHoursPerWeek_idx" ON "User"("availableHoursPerWeek");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_maxTaskDifficulty_idx" ON "User"("maxTaskDifficulty");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishocraticItemInclusion" ADD CONSTRAINT "WishocraticItemInclusion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishocraticItemInclusion" ADD CONSTRAINT "WishocraticItemInclusion_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishocraticItemAlignmentScore" ADD CONSTRAINT "WishocraticItemAlignmentScore_alignmentScoreId_fkey" FOREIGN KEY ("alignmentScoreId") REFERENCES "AlignmentScore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishocraticItemAlignmentScore" ADD CONSTRAINT "WishocraticItemAlignmentScore_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneePersonId_fkey" FOREIGN KEY ("assigneePersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_currentImpactEstimateSetId_fkey" FOREIGN KEY ("currentImpactEstimateSetId") REFERENCES "TaskImpactEstimateSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskClaim" ADD CONSTRAINT "TaskClaim_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskClaim" ADD CONSTRAINT "TaskClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskClaim" ADD CONSTRAINT "TaskClaim_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSourceArtifact" ADD CONSTRAINT "TaskSourceArtifact_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSourceArtifact" ADD CONSTRAINT "TaskSourceArtifact_sourceArtifactId_fkey" FOREIGN KEY ("sourceArtifactId") REFERENCES "SourceArtifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskEdge" ADD CONSTRAINT "TaskEdge_fromTaskId_fkey" FOREIGN KEY ("fromTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskEdge" ADD CONSTRAINT "TaskEdge_toTaskId_fkey" FOREIGN KEY ("toTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskImpactEstimateSet" ADD CONSTRAINT "TaskImpactEstimateSet_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskImpactFrameEstimate" ADD CONSTRAINT "TaskImpactFrameEstimate_taskImpactEstimateSetId_fkey" FOREIGN KEY ("taskImpactEstimateSetId") REFERENCES "TaskImpactEstimateSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskImpactMetric" ADD CONSTRAINT "TaskImpactMetric_taskImpactFrameEstimateId_fkey" FOREIGN KEY ("taskImpactFrameEstimateId") REFERENCES "TaskImpactFrameEstimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskImpactSourceArtifact" ADD CONSTRAINT "TaskImpactSourceArtifact_taskImpactEstimateSetId_fkey" FOREIGN KEY ("taskImpactEstimateSetId") REFERENCES "TaskImpactEstimateSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskImpactSourceArtifact" ADD CONSTRAINT "TaskImpactSourceArtifact_sourceArtifactId_fkey" FOREIGN KEY ("sourceArtifactId") REFERENCES "SourceArtifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishPoint" ADD CONSTRAINT "WishPoint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishPoint" ADD CONSTRAINT "WishPoint_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
