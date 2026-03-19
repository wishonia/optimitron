"use client";

import type { ReactNode } from "react";
import type { State } from "wagmi";
import { SessionProvider } from "next-auth/react";
import { AuthPostSigninSync } from "@/components/auth/AuthPostSigninSync";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Web3Provider } from "@/components/providers/Web3Provider";

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Web3Provider initialState={initialState}>
          <AuthPostSigninSync />
          {children}
        </Web3Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}
