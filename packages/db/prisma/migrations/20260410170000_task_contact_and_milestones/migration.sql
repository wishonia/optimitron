ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'CONTACTED_ASSIGNEE';

DO $$
BEGIN
  CREATE TYPE "TaskMilestoneStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Task"
ADD COLUMN "ownerUserId" TEXT,
ADD COLUMN "contactUrl" TEXT,
ADD COLUMN "contactLabel" TEXT,
ADD COLUMN "contactTemplate" TEXT;

CREATE INDEX "Task_ownerUserId_idx" ON "Task"("ownerUserId");

ALTER TABLE "Task"
ADD CONSTRAINT "Task_ownerUserId_fkey"
FOREIGN KEY ("ownerUserId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "TaskMilestone" (
  "id" TEXT NOT NULL,
  "taskId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "TaskMilestoneStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "evidenceUrl" TEXT,
  "evidenceNote" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "completedAt" TIMESTAMP(3),
  "verifiedAt" TIMESTAMP(3),
  "verifiedByUserId" TEXT,
  "metadataJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),

  CONSTRAINT "TaskMilestone_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TaskMilestone_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TaskMilestone_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "TaskMilestone_taskId_key_key" ON "TaskMilestone"("taskId", "key");
CREATE INDEX "TaskMilestone_taskId_sortOrder_idx" ON "TaskMilestone"("taskId", "sortOrder");
CREATE INDEX "TaskMilestone_verifiedByUserId_idx" ON "TaskMilestone"("verifiedByUserId");
CREATE INDEX "TaskMilestone_status_idx" ON "TaskMilestone"("status");
CREATE INDEX "TaskMilestone_deletedAt_idx" ON "TaskMilestone"("deletedAt");
