"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthPostSigninSync } from "@/components/auth/AuthPostSigninSync";
import { ThemeProvider } from "@/components/ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthPostSigninSync />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
