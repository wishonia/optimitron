import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ identifier: string }>;
}

export default async function Page({ params }: PageProps) {
  const { identifier } = await params;
  redirect(`/agencies/dfec/alignment/${identifier}`);
}
