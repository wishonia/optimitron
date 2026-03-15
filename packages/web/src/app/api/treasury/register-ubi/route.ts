import { NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, hardhat } from "viem/chains";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { getContracts } from "@/lib/contracts/addresses";
import { alignmentTreasuryAbi } from "@/lib/contracts/alignment-treasury-abi";

export const runtime = "nodejs";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function getChain() {
  const chainId = Number(process.env.TREASURY_CHAIN_ID ?? "11155111");
  return chainId === 31337 ? hardhat : sepolia;
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();

    const body = (await request.json()) as { walletAddress?: string };
    const walletAddress = body.walletAddress;

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address." },
        { status: 400 },
      );
    }

    // Check World ID verification
    const verification = await prisma.personhoodVerification.findFirst({
      where: {
        userId,
        provider: "WORLD_ID",
        status: "VERIFIED",
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "World ID verification required before registering for UBI." },
        { status: 403 },
      );
    }

    // Get treasury owner private key
    const ownerKey = process.env.TREASURY_OWNER_PRIVATE_KEY;
    if (!ownerKey) {
      return NextResponse.json(
        { error: "Treasury not configured. Contact admin." },
        { status: 503 },
      );
    }

    const chain = getChain();
    const contracts = getContracts(chain.id);
    const treasuryAddress = contracts?.alignmentTreasury;

    if (!treasuryAddress || treasuryAddress === ZERO_ADDRESS) {
      return NextResponse.json(
        { error: "Treasury contract not deployed on this network." },
        { status: 503 },
      );
    }

    // Convert nullifier hash (externalId from World ID) to bytes32
    const nullifierHash = verification.externalId as `0x${string}`;

    const account = privateKeyToAccount(ownerKey as `0x${string}`);
    const rpcUrl = process.env.TREASURY_RPC_URL ?? chain.rpcUrls.default.http[0];

    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(rpcUrl),
    });

    const publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });

    // Call registerForUBI on the treasury contract
    const hash = await walletClient.writeContract({
      address: treasuryAddress as Address,
      abi: alignmentTreasuryAbi,
      functionName: "registerForUBI",
      args: [walletAddress as Address, nullifierHash],
    });

    // Wait for confirmation
    await publicClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({ success: true, txHash: hash });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message =
      error instanceof Error ? error.message : "UBI registration failed.";
    console.error("[TREASURY REGISTER UBI] Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
