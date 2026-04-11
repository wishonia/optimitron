import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { McpConsentForm } from "./consent-form";

export default async function McpAuthorizePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const clientId = typeof params.client_id === "string" ? params.client_id : null;
  const redirectUri = typeof params.redirect_uri === "string" ? params.redirect_uri : null;
  const state = typeof params.state === "string" ? params.state : null;
  const scope = typeof params.scope === "string" ? params.scope : "tasks:read search";
  const codeChallenge = typeof params.code_challenge === "string" ? params.code_challenge : null;
  const clientName = typeof params.client_name === "string" ? params.client_name : clientId;

  if (!clientId || !redirectUri || !codeChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brutal-pink text-brutal-pink-foreground">
        <div className="border-4 border-primary bg-background text-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-black uppercase">Invalid Request</h1>
          <p className="mt-2 font-bold">Missing required OAuth parameters.</p>
        </div>
      </div>
    );
  }

  // Check if user is signed in
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Redirect to sign in, then back here
    const currentUrl = new URL("/mcp/authorize", process.env.NEXTAUTH_URL ?? "http://localhost:3001");
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") currentUrl.searchParams.set(key, value);
    }
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(currentUrl.toString())}`);
  }

  const requestedScopes = scope.split(" ").filter(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-brutal-cyan text-brutal-cyan-foreground">
      <div className="w-full max-w-md">
        <div className="border-4 border-primary bg-background text-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-black uppercase mb-2">Authorize App</h1>
          <p className="font-bold text-muted-foreground mb-6">
            <span className="text-foreground">{clientName}</span> wants to access your Optimitron account.
          </p>

          <div className="mb-6">
            <h2 className="text-sm font-black uppercase mb-2">Requested Permissions</h2>
            <ul className="space-y-2">
              {requestedScopes.map((s) => (
                <li key={s} className="flex items-center gap-2 font-bold text-sm">
                  <span className="inline-block w-5 h-5 bg-brutal-green text-brutal-green-foreground text-center font-black border-2 border-primary">
                    ✓
                  </span>
                  {scopeLabel(s)}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs font-bold text-muted-foreground mb-6">
            Signed in as {session.user.email ?? session.user.name ?? "Unknown"}
          </p>

          <McpConsentForm
            clientId={clientId}
            redirectUri={redirectUri}
            state={state}
            scope={scope}
            codeChallenge={codeChallenge}
          />
        </div>
      </div>
    </div>
  );
}

function scopeLabel(scope: string): string {
  switch (scope) {
    case "tasks:read":
      return "View public tasks and funding stats";
    case "tasks:write":
      return "Create and update tasks";
    case "tasks:personal":
      return "Manage your personal tasks and claims";
    case "agent:run":
      return "Run agents, acquire leases, log costs";
    case "search":
      return "Search documentation and ask Wishonia";
    default:
      return scope;
  }
}
