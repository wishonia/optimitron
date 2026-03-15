"use client";

import { useState } from "react";

interface ShareTemplatesCardProps {
  referralUrl: string;
}

const TEMPLATES = [
  {
    label: "The Math One",
    text: (url: string) =>
      `The break-even probability shift for an Incentive Alignment Bond is 0.0067%. The expected value calculation is embarrassingly simple. ${url}`,
  },
  {
    label: "The Dysfunction Tax",
    text: (url: string) =>
      `You're paying ~$5,700/year in political dysfunction tax. A bond that tries to fix that needs a 0.0067% chance of working to be worth buying. Worst case: ~1.8x return from yield. ${url}`,
  },
  {
    label: "The Pluralistic Ignorance",
    text: (url: string) =>
      `Everyone wants better health outcomes. Nobody knows everyone else wants it too. The only bottleneck is proving demand exists. Every verified vote makes it harder to ignore. ${url}`,
  },
  {
    label: "The Singapore Comparison",
    text: (url: string) =>
      `Singapore spends 25% of what the US spends on healthcare. Their people live 6 years longer. We're not proposing something radical — we're proposing copying what works. ${url}`,
  },
  {
    label: "The Short One",
    text: (url: string) =>
      `Buy a bond. Share your link. Every verified vote you bring in = bigger share of the success pool. Fail case: ~1.8x return. ${url}`,
  },
];

export function ShareTemplatesCard({ referralUrl }: ShareTemplatesCardProps) {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = async (index: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-black uppercase text-black mb-4">
        Share Templates
      </h3>
      <p className="text-sm font-medium text-black/60 mb-4">
        Copy-paste messages with your referral link baked in.
      </p>
      <div className="space-y-3">
        {TEMPLATES.map((template, index) => {
          const message = template.text(referralUrl);
          return (
            <div
              key={template.label}
              className="border-2 border-black/20 p-3 flex items-start gap-3"
            >
              <div className="flex-1">
                <div className="text-xs font-black uppercase text-black/40 mb-1">
                  {template.label}
                </div>
                <p className="text-sm text-black/70 font-medium leading-relaxed">
                  {message}
                </p>
              </div>
              <button
                onClick={() => void handleCopy(index, message)}
                className="shrink-0 border-2 border-black bg-brutal-yellow px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                {copied === index ? "Copied!" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
