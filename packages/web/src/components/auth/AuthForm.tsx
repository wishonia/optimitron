"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCard } from "@/components/ui/alert-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLogger } from "@/lib/logger";
import { storage } from "@/lib/storage";

const logger = createLogger("auth-form");

type AuthMode = "signup" | "signin";

interface AuthFormProps {
  callbackUrl?: string;
  referralCode?: string | null;
  initialError?: string | null;
  onSuccess?: () => void;
  compact?: boolean;
}

export function AuthForm({
  callbackUrl = "/vote",
  referralCode,
  initialError = null,
  onSuccess,
  compact = false,
}: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<"credentials" | "google" | "magic" | null>(null);

  const isSignup = mode === "signup";
  const isLoading = pendingAction !== null;
  const fieldClassName = compact ? "h-11 text-base" : "h-12 text-base";
  const buttonClassName = compact ? "h-11 text-sm" : "h-12 text-base";
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED !== "false";
  const magicLinkEnabled = process.env.NEXT_PUBLIC_MAGIC_LINK_ENABLED !== "false";

  useEffect(() => {
    setName(storage.getSignupName() ?? "");
    setNewsletterSubscribed(storage.getSignupSubscribe() ?? true);
  }, []);

  useEffect(() => {
    if (!initialError) {
      return;
    }

    setError(initialError);
  }, [initialError]);

  function persistAuthContext() {
    if (referralCode) {
      storage.setSignupReferral(referralCode);
    } else {
      storage.clearSignupReferral();
    }

    if (isSignup) {
      if (name.trim()) {
        storage.setSignupName(name.trim());
      } else {
        storage.clearSignupName();
      }

      storage.setSignupSubscribe(newsletterSubscribed);
      return;
    }

    storage.clearSignupName();
    storage.clearSignupSubscribe();
  }

  async function completeAuth() {
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Unable to sign in with those credentials.");
    }

    onSuccess?.();
    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfoMessage("");
    setPendingAction("credentials");

    try {
      if (!email.trim()) {
        throw new Error("Email is required.");
      }

      if (!password) {
        throw new Error("Password is required.");
      }

      if (isSignup) {
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }

        persistAuthContext();

        const signupResponse = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            referralCode,
            newsletterSubscribed,
          }),
        });

        const signupResult = (await signupResponse.json()) as { error?: string };
        if (!signupResponse.ok) {
          throw new Error(signupResult.error ?? "Unable to create your account.");
        }

        storage.clearSignupData();
      }

      await completeAuth();
    } catch (caughtError) {
      logger.error("Authentication failed", caughtError);
      setError(
        caughtError instanceof Error ? caughtError.message : "Authentication failed. Please try again.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleMagicLink() {
    setError("");
    setInfoMessage("");
    setPendingAction("magic");

    try {
      if (!email.trim()) {
        throw new Error("Email is required for a magic link.");
      }

      persistAuthContext();

      const result = await signIn("email", {
        email: email.trim(),
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Unable to send a magic link right now.");
      }

      setInfoMessage("Check your email for a magic link.");
    } catch (caughtError) {
      logger.error("Magic-link request failed", caughtError);
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to send a magic link right now.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setInfoMessage("");
    setPendingAction("google");

    try {
      persistAuthContext();
      await signIn("google", { callbackUrl });
    } catch (caughtError) {
      logger.error("Google sign-in failed", caughtError);
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to continue with Google.",
      );
      setPendingAction(null);
    }
  }

  return (
    <div className="w-full rounded-xl border-4 border-black bg-white p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-5 text-center">
        <h2 className="text-xl font-black uppercase">
          {isSignup ? "Create Your Account" : "Sign In"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSignup
            ? "Save allocations, sync progress, and get a personal referral link."
            : "Pick up where you left off and keep your allocations synced."}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={isSignup ? "default" : "outline"}
          className={`font-bold uppercase ${buttonClassName}`}
          onClick={() => {
            setMode("signup");
            setError("");
            setInfoMessage("");
          }}
        >
          Sign Up
        </Button>
        <Button
          type="button"
          variant={!isSignup ? "default" : "outline"}
          className={`font-bold uppercase ${buttonClassName}`}
          onClick={() => {
            setMode("signin");
            setError("");
            setInfoMessage("");
          }}
        >
          Sign In
        </Button>
      </div>

      {error ? <AlertCard type="error" message={error} className="mb-4" /> : null}
      {infoMessage ? <AlertCard type="info" message={infoMessage} className="mb-4" /> : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isSignup ? (
          <div className="space-y-2">
            <Label className="font-bold uppercase" htmlFor="auth-name">
              Name
            </Label>
            <Input
              id="auth-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Doe"
              className={fieldClassName}
              disabled={isLoading}
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label className="font-bold uppercase" htmlFor="auth-email">
            Email
          </Label>
          <Input
            id="auth-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={fieldClassName}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold uppercase" htmlFor="auth-password">
            Password
          </Label>
          <Input
            id="auth-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isSignup ? "Use at least 8 characters" : "Enter your password"}
            className={fieldClassName}
            disabled={isLoading}
            required
          />
        </div>

        {isSignup ? (
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-black bg-muted/40 p-3">
            <Checkbox
              checked={newsletterSubscribed}
              onCheckedChange={(checked) => setNewsletterSubscribed(checked === true)}
              disabled={isLoading}
              className="mt-0.5"
            />
            <span className="text-sm font-medium">
              Send me updates about Optomitron, Wishocracy, and new reports.
            </span>
          </label>
        ) : null}

        {referralCode && isSignup ? (
          <p className="text-xs font-bold uppercase text-muted-foreground">
            Referral detected: {referralCode}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full font-black uppercase ${buttonClassName}`}
        >
          {pendingAction === "credentials"
            ? "Working..."
            : isSignup
              ? "Create Account"
              : "Sign In"}
        </Button>
      </form>

      {magicLinkEnabled || googleEnabled ? (
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 text-xs font-bold uppercase text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {magicLinkEnabled ? (
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className={`w-full font-bold uppercase ${buttonClassName}`}
              onClick={() => {
                void handleMagicLink();
              }}
            >
              {pendingAction === "magic" ? "Sending Link..." : "Email Me a Magic Link"}
            </Button>
          ) : null}

          {googleEnabled ? (
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className={`w-full font-bold uppercase ${buttonClassName}`}
              onClick={() => {
                void handleGoogleSignIn();
              }}
            >
              {pendingAction === "google" ? "Redirecting..." : "Continue with Google"}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
