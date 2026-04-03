DROP INDEX "VoteTokenMint_userId_referendumId_key";

CREATE INDEX "VoteTokenMint_userId_referendumId_idx" ON "VoteTokenMint"("userId", "referendumId");
