"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import * as ReactDialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { shareableSnippets } from "@optimitron/data/parameters";
import { Button } from "@/components/retroui/Button";
import { storage } from "@/lib/storage";
import { syncPendingDeclarationVote } from "@/lib/declaration-vote-sync";

const DECLARATION_SLUG = "declaration-of-optimization";

export function DeclarationSigningPopup() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [signing, setSigning] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const signed = storage.getDeclarationSigned();
    if (!signed) {
      setOpen(true);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setScrolledToBottom(true);
    }
  }, []);

  const handleSign = async () => {
    setSigning(true);

    storage.setDeclarationSigned({ signedAt: new Date().toISOString() });

    if (status === "authenticated" && session?.user?.id) {
      try {
        await fetch(`/api/referendums/${DECLARATION_SLUG}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: "YES" }),
        });
      } catch {
        // Vote recorded locally; will retry on next login.
      }
    } else {
      storage.setPendingDeclarationVote({
        answer: "YES",
        timestamp: new Date().toISOString(),
      });
    }

    setOpen(false);
    setSigning(false);
  };

  if (!open) return null;

  return (
    <ReactDialog.Root open={open} onOpenChange={() => { /* block dismiss */ }}>
      <ReactDialog.Portal>
        <ReactDialog.Overlay className="fixed inset-0 z-[100] bg-black/90" />
        <ReactDialog.Content
          className="fixed inset-0 z-[100] flex flex-col bg-background"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <VisuallyHidden>
            <ReactDialog.Title>Declaration of Optimization</ReactDialog.Title>
          </VisuallyHidden>

          {/* Header */}
          <div className="sticky top-0 z-10 border-b-4 border-primary bg-brutal-yellow px-6 py-4 text-brutal-yellow-foreground">
            <h2 className="text-center text-2xl font-black uppercase tracking-tight sm:text-3xl">
              Declaration of Optimization
            </h2>
            <p className="mt-1 text-center text-sm font-bold">
              Read the declaration below, then sign to proceed
            </p>
          </div>

          {/* Scrollable body */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 md:px-16 lg:px-24"
          >
            <div className="mx-auto max-w-3xl">
              <div className="space-y-6 text-foreground">
                {/* Why Optimization Is Necessary */}
                <div className="border-4 border-primary bg-brutal-red p-6 text-brutal-red-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="text-base font-bold leading-8">
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="font-black underline underline-offset-4"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {shareableSnippets.whyOptimizationIsNecessary.markdown}
                  </ReactMarkdown>
                </div>

                <hr className="border-t-4 border-primary" />

                {/* The Declaration */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-black uppercase tracking-tight">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="border-t-4 border-primary pt-6 text-2xl font-black uppercase tracking-tight">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-center text-xl font-black uppercase tracking-tight sm:text-2xl">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-base font-bold leading-8 text-muted-foreground">
                        {children}
                      </p>
                    ),
                    a: ({ href, children }) => {
                      const target = href ?? "#";
                      const isExternal = target.startsWith("http");
                      if (isExternal) {
                        return (
                          <a
                            href={target}
                            target="_blank"
                            rel="noreferrer"
                            className="font-black text-brutal-pink underline underline-offset-4"
                          >
                            {children}
                          </a>
                        );
                      }
                      return (
                        <Link
                          href={target}
                          className="font-black text-brutal-pink underline underline-offset-4"
                        >
                          {children}
                        </Link>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-brutal-pink bg-muted px-4 py-3 text-sm font-bold text-foreground">
                        {children}
                      </blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc space-y-2 pl-6 text-base font-bold text-muted-foreground">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal space-y-2 pl-6 text-base font-bold text-muted-foreground">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li>{children}</li>,
                    hr: () => <hr className="border-t-4 border-primary" />,
                  }}
                >
                  {shareableSnippets.declarationOfOptimization.markdown}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 border-t-4 border-primary bg-primary px-6 py-4">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-2">
              {!scrolledToBottom && (
                <p className="text-xs font-bold text-primary-foreground">
                  Scroll to the bottom to sign
                </p>
              )}
              <Button
                onClick={() => void handleSign()}
                disabled={!scrolledToBottom || signing}
                className="w-full max-w-md border-4 border-background px-8 py-4 text-lg font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 sm:w-auto"
                variant="secondary"
              >
                {signing ? "Signing..." : "I Sign This Declaration"}
              </Button>
            </div>
          </div>
        </ReactDialog.Content>
      </ReactDialog.Portal>
    </ReactDialog.Root>
  );
}
