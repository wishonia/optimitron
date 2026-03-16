import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/prize-treasury/status
 *
 * Returns the current state of the Voter Prize Treasury:
 * - Total deposits (TVL from DB records)
 * - Total confirmed VOTE mints
 * - Deposit count
 *
 * In production, on-chain data (actual TVL, Aave yield, metrics)
 * would be fetched via ethers.js or a subgraph.
 */
export async function GET() {
  try {
    const [deposits, voteMintsCount] = await Promise.all([
      prisma.prizeTreasuryDeposit.findMany({
        where: { deletedAt: null },
        select: { amount: true, depositorAddress: true },
      }),
      prisma.voteTokenMint.count({
        where: { status: "CONFIRMED", deletedAt: null },
      }),
    ]);

    const totalDeposited = deposits
      .reduce((sum, d) => sum + BigInt(d.amount), 0n)
      .toString();

    const uniqueDepositors = new Set(deposits.map((d) => d.depositorAddress))
      .size;

    return NextResponse.json({
      totalDeposited,
      depositCount: deposits.length,
      uniqueDepositors,
      confirmedVoteMints: voteMintsCount,
      // TODO: Add on-chain data when connected:
      // totalAssets (including Aave yield)
      // healthMetric, incomeMetric
      // maturityTimestamp
      // thresholdMet
      // voteTotalSupplySnapshot
    });
  } catch (error) {
    console.error("[PRIZE TREASURY STATUS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prize treasury status" },
      { status: 500 },
    );
  }
}
