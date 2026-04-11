"use client";

import { useState } from "react";
import { Button } from "@/components/retroui/Button";

export function McpConsentForm({
  clientId,
  redirectUri,
  state,
  scope,
  codeChallenge,
}: {
  clientId: string;
  redirectUri: string;
  state: string | null;
  scope: string;
  codeChallenge: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    try {
      const res = await fetch("/api/mcp/oauth/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          redirect_uri: redirectUri,
          state,
          scope,
          code_challenge: codeChallenge,
          approved: true,
        }),
      });

      const data = await res.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch {
      setLoading(false);
    }
  }

  function handleDeny() {
    const url = new URL(redirectUri);
    url.searchParams.set("error", "access_denied");
    if (state) url.searchParams.set("state", state);
    window.location.href = url.toString();
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleApprove}
        disabled={loading}
        className="flex-1"
      >
        {loading ? "Authorizing..." : "Authorize"}
      </Button>
      <Button
        variant="outline"
        onClick={handleDeny}
        disabled={loading}
        className="flex-1"
      >
        Deny
      </Button>
    </div>
  );
}
