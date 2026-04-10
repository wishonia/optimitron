"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import * as ReactDialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown } from "lucide-react";
import { shareableSnippets } from "@optimitron/data/parameters";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { storage } from "@/lib/storage";

const DECLARATION_SLUG = "declaration-of-optimization";
const GITHUB_EDIT_URL =
  "https://github.com/mikepsinn/disease-eradication-plan/edit/main/knowledge/strategy/declaration-of-optimization.qmd";

function WhyParagraph({ markdown }: { markdown: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex min-h-[80vh] items-center"
    >
      <div
        className={`w-full transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="text-center text-2xl leading-relaxed text-foreground [font-family:var(--v0-font-libre-baskerville)] [overflow-wrap:break-word] sm:text-3xl">
                {children}
              </p>
            ),
            a: ({ href, children }) => (
              <a
                href={href ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="font-black text-foreground"
              >
                {children}
              </a>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export function DeclarationSigningPopup() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !storage.getDeclarationSigned();
  });
  const [showSignature, setShowSignature] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signing, setSigning] = useState(false);
  const whyParagraphs = useMemo(
    () =>
      shareableSnippets.whyOptimizationIsNecessary.markdown
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean),
    [],
  );
  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);
  const declarationRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentWhyIndex, setCurrentWhyIndex] = useState(0);
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Hide arrow when declaration divider is visible or at the bottom
      const decl = declarationRef.current;
      const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 60;
      let pastWhy = false;
      if (decl) {
        const declTop = decl.offsetTop;
        pastWhy = container.scrollTop + container.clientHeight > declTop;
      }
      setShowArrow(!pastWhy && !atBottom);

      let latest = 0;
      for (let i = 0; i < paragraphRefs.current.length; i++) {
        const el = paragraphRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.6) {
            latest = i;
          }
        }
      }
      setCurrentWhyIndex(latest);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNext = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const nextIndex = currentWhyIndex + 1;
    const target = nextIndex < whyParagraphs.length
      ? paragraphRefs.current[nextIndex]
      : declarationRef.current;

    if (!target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset = targetRect.top - containerRect.top + container.scrollTop;

    container.scrollTo({
      top: offset - (container.clientHeight - target.clientHeight) / 2,
      behavior: "smooth",
    });
  };

  const handleAgree = () => {
    setShowSignature(true);
  };

  const handleSubmitSignature = async () => {
    setSigning(true);

    storage.setDeclarationSigned({
      signedAt: new Date().toISOString(),
      name: signatureName.trim() || undefined,
    });

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

  const handleDisagree = () => {
    storage.setDeclarationSigned({ signedAt: new Date().toISOString() });
    window.open(GITHUB_EDIT_URL, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <ReactDialog.Root
      open={open}
      onOpenChange={() => {
        /* block dismiss */
      }}
    >
      <ReactDialog.Portal>
        <ReactDialog.Overlay className="fixed inset-0 z-[100] bg-black/90" />
        <ReactDialog.Content
          className="fixed inset-0 z-[100] flex w-screen max-w-[100vw] flex-col overflow-hidden bg-background"
          aria-describedby={undefined}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <VisuallyHidden>
            <ReactDialog.Title>Declaration of Optimization</ReactDialog.Title>
          </VisuallyHidden>

          {/* Scrollable body */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* WHY section — billboard style */}
            <div className="mx-auto box-border w-full max-w-xl px-6 [overflow-wrap:break-word] sm:px-8">
              {whyParagraphs.map((para, i) => (
                <div
                  key={i}
                  ref={(el) => { paragraphRefs.current[i] = el; }}
                >
                  <WhyParagraph markdown={para} />
                </div>
              ))}
            </div>

            {/* Divider */}
            <div ref={declarationRef} className="mx-auto max-w-3xl px-6 py-8 sm:px-8">
              <hr className="border-t-4 border-primary" />
            </div>

            {/* DECLARATION section — formal document style */}
            <div className="mx-auto max-w-3xl px-6 pb-8 sm:px-8">
              <div className="space-y-8 text-foreground">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-black uppercase tracking-tight text-foreground [font-family:var(--v0-font-libre-baskerville)] sm:text-4xl">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="border-t-4 border-primary pt-6 text-2xl font-black uppercase tracking-tight text-foreground [font-family:var(--v0-font-libre-baskerville)] sm:text-3xl">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-center text-xl font-black uppercase tracking-tight text-foreground [font-family:var(--v0-font-libre-baskerville)] sm:text-2xl">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-6 text-lg leading-8 text-foreground [font-family:var(--v0-font-libre-baskerville)] [overflow-wrap:break-word]">
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
                            className="font-black text-muted-foreground"
                          >
                            {children}
                          </a>
                        );
                      }
                      return (
                        <Link
                          href={target}
                          className="font-black text-muted-foreground"
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

            {/* Agree / Disagree — inline at the end of content */}
            <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
              {!showSignature && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={handleDisagree}
                    className="border-4 border-primary bg-brutal-red px-6 py-3 text-lg font-black uppercase text-brutal-red-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Disagree
                  </Button>
                  <Button
                    onClick={handleAgree}
                    className="border-4 border-primary bg-brutal-green px-6 py-3 text-lg font-black uppercase text-brutal-green-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Agree
                  </Button>
                </div>
              )}

              {showSignature && (
                <div className="mx-auto max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="mb-3 text-center text-lg font-black uppercase text-foreground">
                    Enter your name to become a signatory on the Declaration of Optimization
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="Your name"
                      className="flex-1 border-4 bg-background px-4 py-3 text-lg font-bold"
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
                      className="border-4 border-primary px-8 py-3 text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                      variant="secondary"
                    >
                      {signing ? "Signing..." : "Sign"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Fixed scroll arrow at bottom of viewport */}
          {showArrow && (
            <button
              onClick={scrollToNext}
              className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce cursor-pointer text-muted-foreground transition-opacity hover:text-foreground"
              aria-label="Next paragraph"
            >
              <ChevronDown className="h-10 w-10" />
            </button>
          )}
        </ReactDialog.Content>
      </ReactDialog.Portal>
    </ReactDialog.Root>
  );
}
