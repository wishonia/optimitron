"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type GovernmentMetrics,
  getGovernmentsByHALE,
  getMilitaryToHealthRatio,
} from "@optimitron/data";

type SortKey = "hale" | "lifeExpectancy" | "gdpPerCapita" | "militarySpending" | "healthSpending" | "ratio";

function formatUSD(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

function ratioColor(ratio: number | null): string {
  if (ratio === null) return "text-muted-foreground";
  if (ratio < 0.5) return "text-brutal-cyan";
  if (ratio < 1) return "text-foreground";
  return "text-brutal-red";
}

function getSortValue(gov: GovernmentMetrics, key: SortKey): number {
  switch (key) {
    case "hale": return gov.hale?.value ?? 0;
    case "lifeExpectancy": return gov.lifeExpectancy.value;
    case "gdpPerCapita": return gov.gdpPerCapita.value;
    case "militarySpending": return gov.militarySpendingAnnual.value;
    case "healthSpending": return gov.healthSpendingPerCapita.value;
    case "ratio": return getMilitaryToHealthRatio(gov) ?? 999;
  }
}

interface GovernmentLeaderboardProps {
  /** Max rows to show (default: all) */
  limit?: number;
  /** Show compact version (fewer columns) */
  compact?: boolean;
}

export function GovernmentLeaderboard({ limit, compact = false }: GovernmentLeaderboardProps) {
  const [sortKey, setSortKey] = useState<SortKey>("hale");
  const [sortAsc, setSortAsc] = useState(false);

  const allGovs = getGovernmentsByHALE();
  const sorted = [...allGovs].sort((a, b) => {
    const diff = getSortValue(b, sortKey) - getSortValue(a, sortKey);
    return sortAsc ? -diff : diff;
  });
  const govs = limit ? sorted.slice(0, limit) : sorted;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortAsc ? " ↑" : " ↓") : "";

  const headerClass =
    "text-xs font-black uppercase text-muted-foreground cursor-pointer hover:text-foreground transition-colors whitespace-nowrap";

  return (
    <div className="border-4 border-primary bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-4 border-primary">
            <th className="p-3 text-left text-xs font-black uppercase text-muted-foreground">#</th>
            <th className="p-3 text-left text-xs font-black uppercase text-muted-foreground">Country</th>
            <th className={`p-3 text-right ${headerClass}`} onClick={() => handleSort("hale")}>
              HALE{sortIndicator("hale")}
            </th>
            {!compact && (
              <th className={`p-3 text-right ${headerClass}`} onClick={() => handleSort("lifeExpectancy")}>
                Life Exp{sortIndicator("lifeExpectancy")}
              </th>
            )}
            <th className={`p-3 text-right ${headerClass}`} onClick={() => handleSort("gdpPerCapita")}>
              Income{sortIndicator("gdpPerCapita")}
            </th>
            {!compact && (
              <>
                <th className={`p-3 text-right ${headerClass}`} onClick={() => handleSort("militarySpending")}>
                  Military{sortIndicator("militarySpending")}
                </th>
                <th className={`p-3 text-right ${headerClass}`} onClick={() => handleSort("healthSpending")}>
                  Health/cap{sortIndicator("healthSpending")}
                </th>
              </>
            )}
            <th className={`p-3 text-right ${headerClass}`} onClick={() => handleSort("ratio")}>
              Mil/Health{sortIndicator("ratio")}
            </th>
          </tr>
        </thead>
        <tbody>
          {govs.map((gov, i) => {
            const ratio = getMilitaryToHealthRatio(gov);
            return (
              <tr
                key={gov.code}
                className="border-b-2 border-primary last:border-b-0 hover:bg-muted transition-colors"
              >
                <td className="p-3 font-black text-muted-foreground">{i + 1}</td>
                <td className="p-3">
                  <Link
                    href={`/governments/${gov.code}`}
                    className="hover:text-brutal-pink transition-colors"
                  >
                    <span className="text-xl mr-2">{gov.flag}</span>
                    <span className="font-black text-foreground">{gov.name}</span>
                  </Link>
                </td>
                <td className="p-3 text-right font-black text-brutal-cyan">
                  {gov.hale?.value.toFixed(1) ?? "—"}
                </td>
                {!compact && (
                  <td className="p-3 text-right font-bold text-foreground">
                    {gov.lifeExpectancy.value.toFixed(1)}
                  </td>
                )}
                <td className="p-3 text-right font-black text-foreground">
                  {formatUSD(gov.gdpPerCapita.value)}
                </td>
                {!compact && (
                  <>
                    <td className="p-3 text-right font-bold text-foreground">
                      {formatUSD(gov.militarySpendingAnnual.value)}
                    </td>
                    <td className="p-3 text-right font-bold text-foreground">
                      {formatUSD(gov.healthSpendingPerCapita.value)}
                    </td>
                  </>
                )}
                <td className={`p-3 text-right font-black ${ratioColor(ratio)}`}>
                  {ratio !== null ? `${ratio.toFixed(1)}:1` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
