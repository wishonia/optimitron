export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-yellow-300 px-4 py-12">
      <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Check Your Inbox
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase">Magic Link Sent</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Open the email we just sent you and click the sign-in link. If it does not arrive within
          a minute, check spam and then try again.
        </p>
      </div>
    </main>
  );
}
