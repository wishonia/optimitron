import { WISHONIA_VOICE_PROMPT } from "@/lib/wishonia-chat";

/**
 * Centralized ephemeral token endpoint for Gemini Live API.
 * Uses the raw REST API (proven approach from transmit) rather than
 * the @google/genai SDK which hits a 404 on authTokens.create.
 */
export async function GET() {
  const apiKey = process.env["GOOGLE_GENERATIVE_AI_API_KEY"];
  if (!apiKey) {
    return Response.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY not configured" },
      { status: 503 },
    );
  }

  try {
    const now = Date.now();
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1alpha/auth_tokens",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          uses: 1,
          expire_time: new Date(now + 30 * 60 * 1000).toISOString(),
          new_session_expire_time: new Date(now + 2 * 60 * 1000).toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[gemini-live-token] API error:", err);
      return Response.json(
        { error: "Token creation failed", detail: err },
        { status: 502 },
      );
    }

    const data = await response.json();

    return Response.json({
      token: data.name,
      systemPrompt: WISHONIA_VOICE_PROMPT,
    });
  } catch (err) {
    console.error("[gemini-live-token] Failed to create token:", err);
    return Response.json(
      { error: "Failed to create ephemeral token" },
      { status: 500 },
    );
  }
}

/** Handle CORS preflight */
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
