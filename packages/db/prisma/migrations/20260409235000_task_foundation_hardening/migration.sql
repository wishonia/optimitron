UPDATE "Task"
SET "status" = 'VERIFIED'
WHERE "status" = 'COMPLETED';

UPDATE "Task"
SET "status" = 'STALE'
WHERE "status" = 'CANCELLED';

CREATE TYPE "TaskStatus_new" AS ENUM ('DRAFT', 'ACTIVE', 'VERIFIED', 'STALE');

ALTER TABLE "Task"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Task"
ALTER COLUMN "status" TYPE "TaskStatus_new"
USING ("status"::text::"TaskStatus_new");

DROP TYPE "TaskStatus";

ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";

ALTER TABLE "Task"
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

DROP INDEX IF EXISTS "Person_sourceRef_idx";
CREATE UNIQUE INDEX "Person_sourceRef_key" ON "Person"("sourceRef");

DROP INDEX IF EXISTS "User_personId_idx";
DROP INDEX IF EXISTS "Task_currentImpactEstimateSetId_idx";
DROP INDEX IF EXISTS "Task_taskKey_idx";
