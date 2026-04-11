-- Idempotent: column may already be renamed from a partial prior run
DO $$ BEGIN
  ALTER TABLE "Task" RENAME COLUMN "currentAffiliation" TO "assigneeAffiliationSnapshot";
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "Person_sourceRef_idx" ON "Person"("sourceRef");
