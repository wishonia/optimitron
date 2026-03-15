"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BondholderDashboard } from "@/components/prize/BondholderDashboard";

export function BondholderDashboardWrapper() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Capture referral code from URL for attribution at signup
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("ref", ref);
    }

    // Fetch the current user's username/referralCode for building share links
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{
          username?: string;
          referralCode?: string;
        }>;
      })
      .then((profile) => {
        if (profile) {
          setUsername(profile.username ?? profile.referralCode ?? null);
        }
      })
      .catch(() => {
        // Not logged in — that's fine
      });
  }, [searchParams]);

  return <BondholderDashboard username={username} />;
}
