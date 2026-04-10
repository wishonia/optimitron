ALTER TABLE "Task"
RENAME COLUMN "currentAffiliation" TO "assigneeAffiliationSnapshot";

CREATE INDEX "Person_sourceRef_idx" ON "Person"("sourceRef");
