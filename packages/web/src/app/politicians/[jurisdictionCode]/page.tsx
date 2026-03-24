import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ jurisdictionCode: string }>;
}

export default async function LegacyPoliticiansPage({ params }: PageProps) {
  const { jurisdictionCode } = await params;
  redirect(`/governments/${jurisdictionCode}/politicians`);
}
