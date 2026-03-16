import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BATCH_SIZE = 200;

/**
 * Batch minting cron job for VOTE tokens.
 *
 * 1. Fetches all PENDING VoteTokenMint records
 * 2. Groups into batches of ~200
 * 3. Calls VoteToken.batchMintForVoters() on-chain
 * 4. Updates status to SUBMITTED → CONFIRMED on tx confirmation
 *
 * In production this would use ethers.js + a relayer wallet to submit
 * on-chain transactions. For now, this updates the DB status to track
 * the batch minting pipeline.
 */
export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pendingMints = await prisma.voteTokenMint.findMany({
      where: { status: "PENDING", deletedAt: null },
      orderBy: { createdAt: "asc" },
      take: BATCH_SIZE,
    });

    if (pendingMints.length === 0) {
      return NextResponse.json({ processed: 0, message: "No pending mints" });
    }

    // Mark as SUBMITTED before on-chain call
    const ids = pendingMints.map((m) => m.id);
    await prisma.voteTokenMint.updateMany({
      where: { id: { in: ids } },
      data: { status: "SUBMITTED" },
    });

    // TODO: On-chain batch mint call
    // const voteToken = new ethers.Contract(VOTE_TOKEN_ADDRESS, VoteTokenABI, signer);
    // const tx = await voteToken.batchMintForVoters(
    //   pendingMints.map(m => m.walletAddress),
    //   pendingMints.map(m => ethers.keccak256(ethers.toUtf8Bytes(m.referendumId))),
    //   pendingMints.map(m => ethers.keccak256(ethers.toUtf8Bytes(m.nullifierHash))),
    //   pendingMints.map(m => m.amount),
    // );
    // const receipt = await tx.wait();

    // For now, mark as CONFIRMED (replace with actual tx confirmation)
    await prisma.voteTokenMint.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "CONFIRMED",
        // txHash: receipt.hash,
      },
    });

    return NextResponse.json({
      processed: pendingMints.length,
      ids,
    });
  } catch (error) {
    console.error("[VOTE TOKEN MINT CRON] Error:", error);
    return NextResponse.json(
      { error: "Failed to process vote token mints" },
      { status: 500 },
    );
  }
}
