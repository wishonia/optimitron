import politiciansData from "@/data/politicians.json";
import { PoliticianDetailClient } from "./client";

interface PoliticianData {
  id: string;
  name: string;
  party: string;
  state: string;
  chamber: string;
  alignmentScore: number;
  budgetAlignment: Record<string, number>;
  topAligned: string[];
  topMisaligned: string[];
  keyVotes: { bill: string; vote: string; aligned: boolean }[];
}

const politicians = politiciansData as PoliticianData[];

export function generateStaticParams() {
  return politicians.map((p) => ({ id: p.id }));
}

export default function PoliticianDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <PoliticianDetailClient id={params.id} />;
}
