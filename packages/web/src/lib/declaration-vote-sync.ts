import { storage } from "@/lib/storage";

const DECLARATION_SLUG = "declaration-of-optimization";

export async function syncPendingDeclarationVote(): Promise<void> {
  const pending = storage.getPendingDeclarationVote();
  if (!pending) return;

  try {
    const res = await fetch(`/api/referendums/${DECLARATION_SLUG}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: pending.answer }),
    });

    if (res.ok) {
      storage.removePendingDeclarationVote();
    }
  } catch {
    // Vote stays in localStorage for next login attempt.
  }
}
