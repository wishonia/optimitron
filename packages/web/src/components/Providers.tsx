"use client";

import type { ReactNode } from "react";
import type { State } from "wagmi";
import { SessionProvider } from "next-auth/react";
import { AuthPostSigninSync } from "@/components/auth/AuthPostSigninSync";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { WishPointProvider } from "@/components/wishes/WishPointProvider";
import { DeclarationSigningPopup } from "@/components/declaration/DeclarationSigningPopup";

const ENABLE_DECLARATION_POPUP =
  process.env.NEXT_PUBLIC_ENABLE_DECLARATION_POPUP === "true";

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
          <WishPointProvider>
            <AuthPostSigninSync />
            {ENABLE_DECLARATION_POPUP ? <DeclarationSigningPopup /> : null}
            {children}
          </WishPointProvider>
        </Web3Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}
