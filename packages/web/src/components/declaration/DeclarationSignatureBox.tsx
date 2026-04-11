"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { storage } from "@/lib/storage";
import { DECLARATION_SLUG } from "@/lib/declaration";

export function DeclarationSignatureBox() {
  const { status } = useSession();
  const router = useRouter();
  const [signatureName, setSignatureName] = useState("");
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleSubmitSignature = async () => {
    if (!signatureName.trim()) return;
    setSigning(true);

    storage.setDeclarationSigned({
      signedAt: new Date().toISOString(),
      name: signatureName.trim(),
    });

    // Store vote locally — will sync on next authenticated page load
    storage.setPendingDeclarationVote({
      answer: "YES",
      timestamp: new Date().toISOString(),
    });

    // If authenticated, fire-and-forget the API call
    if (status === "authenticated") {
      fetch(`/api/referendums/${DECLARATION_SLUG}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: "YES" }),
      }).catch(() => {});
    }

    setSigning(false);
    setSigned(true);
  };

  if (signed && status !== "authenticated") {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="mb-6 text-xl font-bold text-white [font-family:var(--v0-font-libre-baskerville)]">
          Your signature has been recorded.
        </p>
        <p className="mb-6 text-base text-white/60 [font-family:var(--v0-font-libre-baskerville)]">
          Please sign in to verify and become a signatory of the Declaration of Optimization.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2 rounded border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-black uppercase text-white transition-colors hover:bg-white/20"
          >
            Continue with Google
          </button>
          <button
            onClick={() => void signIn(undefined, { callbackUrl: "/dashboard" })}
            className="text-sm font-bold text-white/40 transition-colors hover:text-white/70"
          >
            Other sign-in options
          </button>
        </div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="mb-4 text-xl font-bold text-white [font-family:var(--v0-font-libre-baskerville)]">
          Your signature has been recorded.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm font-bold text-white/50 transition-colors hover:text-white/80"
        >
          Go to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-6 text-center text-xl font-bold text-white [font-family:var(--v0-font-libre-baskerville)]">
        Sign the Declaration of Optimization
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          placeholder="Your name"
          className="flex-1 border-2 border-white/30 bg-white/10 px-4 py-3 text-lg font-bold text-white placeholder:text-white/30"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && signatureName.trim()) {
              void handleSubmitSignature();
            }
          }}
        />
        <Button
          onClick={() => void handleSubmitSignature()}
          disabled={!signatureName.trim() || signing}
          className="border-2 border-white/30 bg-white/10 px-8 py-3 text-lg font-black uppercase text-white disabled:opacity-30"
        >
          {signing ? "..." : "Sign"}
        </Button>
      </div>
    </div>
  );
}
