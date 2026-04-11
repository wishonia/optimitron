ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'CONTACTED_ASSIGNEE';

DO $$
BEGIN
  CREATE TYPE "TaskMilestoneStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "ownerUserId" TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "contactUrl" TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "contactLabel" TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "contactTemplate" TEXT;

CREATE INDEX IF NOT EXISTS "Task_ownerUserId_idx" ON "Task"("ownerUserId");

DO $$ BEGIN
  ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerUserId_fkey"
  FOREIGN KEY ("ownerUserId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "TaskMilestone" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "TaskMilestone_taskId_key_key" ON "TaskMilestone"("taskId", "key");
CREATE INDEX IF NOT EXISTS "TaskMilestone_taskId_sortOrder_idx" ON "TaskMilestone"("taskId", "sortOrder");
CREATE INDEX IF NOT EXISTS "TaskMilestone_verifiedByUserId_idx" ON "TaskMilestone"("verifiedByUserId");
CREATE INDEX IF NOT EXISTS "TaskMilestone_status_idx" ON "TaskMilestone"("status");
CREATE INDEX IF NOT EXISTS "TaskMilestone_deletedAt_idx" ON "TaskMilestone"("deletedAt");
