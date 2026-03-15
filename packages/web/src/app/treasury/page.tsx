import type { Metadata } from "next";
import { TreasuryDashboard } from "./TreasuryDashboard";

export const metadata: Metadata = {
  title: "$WISH Treasury | Optomitron",
  description:
    "100% of the $WISH transaction tax goes to citizens as Universal Basic Income. No bureaucracy. No means testing. Just proof of personhood and equal shares.",
};

export default function TreasuryPage() {
  return <TreasuryDashboard />;
}
