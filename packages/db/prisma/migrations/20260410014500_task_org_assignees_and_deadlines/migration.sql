ALTER TYPE "OrgType" ADD VALUE IF NOT EXISTS 'GOVERNMENT';
ALTER TYPE "OrgType" ADD VALUE IF NOT EXISTS 'COMPANY';
ALTER TYPE "OrgType" ADD VALUE IF NOT EXISTS 'FOUNDATION';
ALTER TYPE "OrgType" ADD VALUE IF NOT EXISTS 'INTERGOVERNMENTAL';
ALTER TYPE "OrgType" ADD VALUE IF NOT EXISTS 'MEDIA';
ALTER TYPE "OrgType" ADD VALUE IF NOT EXISTS 'POLITICAL_PARTY';
ALTER TYPE "OrgType" ADD VALUE IF NOT EXISTS 'OTHER';

ALTER TABLE "Organization"
ADD COLUMN "sourceUrl" TEXT,
ADD COLUMN "sourceRef" TEXT;

CREATE UNIQUE INDEX "Organization_sourceRef_key" ON "Organization"("sourceRef");
CREATE INDEX "Organization_deletedAt_idx" ON "Organization"("deletedAt");

ALTER TABLE "Task"
RENAME COLUMN "officeTitle" TO "roleTitle";

ALTER TABLE "Task"
ADD COLUMN "assigneeOrganizationId" TEXT,
ADD COLUMN "dueAt" TIMESTAMP(3);

CREATE INDEX "Task_assigneeOrganizationId_idx" ON "Task"("assigneeOrganizationId");
CREATE INDEX "Task_dueAt_idx" ON "Task"("dueAt");

ALTER TABLE "Task"
ADD CONSTRAINT "Task_assigneeOrganizationId_fkey"
FOREIGN KEY ("assigneeOrganizationId") REFERENCES "Organization"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
