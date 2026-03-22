"use client";

import { useState } from "react";

/**
 * Personal Dividend Calculator
 *
 * Shows citizens how much they'd receive monthly from the Universal Dividend
 * funded by efficiency savings identified in the OECD cross-country analysis.
 *
 * Pure client-side math — no API calls. Data from us-budget-analysis.json.
 */

const US_ADULT_POPULATION = 258_000_000;

/** Categories with overspend and potential savings */
const SAVINGS_CATEGORIES = [
  { name: "Military", savingsPerCapita: 1773, overspend: 7.4, checked: true },
  { name: "Healthcare", savingsPerCapita: 7191, overspend: 3.3, checked: true },
  { name: "R&D / Science", savingsPerCapita: 1148, overspend: 2.4, checked: false },
  { name: "Social Programs", savingsPerCapita: 6421, overspend: 2.0, checked: false },
] as const;

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n).toLocaleString("en-US")}`;
  return `$${n.toFixed(2)}`;
}

export function DividendCalculator() {
  const [adults, setAdults] = useState(2);
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(SAVINGS_CATEGORIES.map((c) => [c.name, c.checked]))
  );

  const totalSavingsPerCapita = SAVINGS_CATEGORIES.filter(
    (c) => selected[c.name]
  ).reduce((sum, c) => sum + c.savingsPerCapita, 0);

  const annualTotalSavings = totalSavingsPerCapita * US_ADULT_POPULATION;
  const annualPerAdult = totalSavingsPerCapita;
  const monthlyPerAdult = annualPerAdult / 12;
  const monthlyHousehold = monthlyPerAdult * adults;
  const annualHousehold = annualPerAdult * adults;

  const toggleCategory = (name: string) => {
    setSelected((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="border-4 border-primary bg-background p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="mb-4 text-xl font-black uppercase text-foreground">
        Your Monthly Dividend
      </h3>
      <p className="mb-4 text-sm font-bold text-muted-foreground">
        If the US matched the spending efficiency of top OECD countries, the
        savings could fund a Universal Dividend for every adult citizen.
      </p>

      {/* Category toggles */}
      <div className="mb-4 space-y-2">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          Include savings from:
        </p>
        {SAVINGS_CATEGORIES.map((cat) => (
          <label
            key={cat.name}
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              type="checkbox"
              checked={selected[cat.name] ?? false}
              onChange={() => toggleCategory(cat.name)}
              className="h-5 w-5 accent-brutal-pink"
            />
            <span className="text-sm font-bold text-foreground">
              {cat.name}
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              ({cat.overspend}x overspend → {formatUSD(cat.savingsPerCapita)}
              /yr per adult)
            </span>
          </label>
        ))}
      </div>

      {/* Household size */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">
          Adults in household
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setAdults(n)}
              className={`border-2 border-primary px-4 py-2 text-sm font-black transition-all ${
                adults === n
                  ? "bg-brutal-pink text-brutal-pink-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3 border-t-4 border-primary pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-muted-foreground">
            Your monthly dividend
          </span>
          <span className="text-3xl font-black text-brutal-pink">
            {formatUSD(monthlyHousehold)}
            <span className="text-lg text-muted-foreground">/mo</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-muted-foreground">
            Annual household total
          </span>
          <span className="text-xl font-black text-foreground">
            {formatUSD(annualHousehold)}
            <span className="text-sm text-muted-foreground">/yr</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-muted-foreground">
            Total national savings
          </span>
          <span className="text-lg font-bold text-foreground">
            {formatUSD(annualTotalSavings)}
            <span className="text-sm text-muted-foreground">/yr</span>
          </span>
        </div>
      </div>

      {/* Opt-out note */}
      <p className="mt-4 text-xs font-bold text-muted-foreground">
        Don&apos;t like a reform? Redirect your dividend back to any program you
        choose. Your money, your call.
      </p>
    </div>
  );
}
