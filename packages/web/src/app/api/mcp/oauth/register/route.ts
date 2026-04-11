import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateClientId } from "@/lib/mcp-oauth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const clientName = (body.client_name as string) ?? null;
    const redirectUris = body.redirect_uris as string[] | undefined;
    const grantTypes = (body.grant_types as string[]) ?? [
      "authorization_code",
      "refresh_token",
    ];
    const scope = (body.scope as string) ?? null;
    const clientUri = (body.client_uri as string) ?? null;

    if (!redirectUris || redirectUris.length === 0) {
      return NextResponse.json(
        { error: "invalid_client_metadata", error_description: "redirect_uris is required" },
        { status: 400 },
      );
    }

    const clientId = generateClientId();

    const client = await prisma.oAuthClient.create({
      data: {
        clientId,
        clientName,
        redirectUris,
        grantTypes,
        scope,
        clientUri,
      },
    });

    return NextResponse.json(
      {
        client_id: client.clientId,
        client_name: client.clientName,
        redirect_uris: client.redirectUris,
        grant_types: client.grantTypes,
        scope: client.scope,
        client_uri: client.clientUri,
        client_id_issued_at: Math.floor(client.createdAt.getTime() / 1000),
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "server_error", error_description: message },
      { status: 500 },
    );
  }
}
