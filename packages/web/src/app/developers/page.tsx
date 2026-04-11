import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { Container } from "@/components/ui/container";
import { BrutalCard } from "@/components/ui/brutal-card";
import { MCP_SCOPES } from "@/lib/mcp-server";

export const metadata: Metadata = {
  title: "Developers | Optimitron",
  description:
    "Connect your AI to the Optimitron task system via MCP. Setup instructions for Claude Desktop, Claude Code, and custom integrations.",
};

export default function DevelopersPage() {
  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://optimitron.com";

  return (
    <main>
      {/* Hero */}
      <SectionContainer bgColor="cyan">
        <Container>
          <SectionHeader
            title="Developers"
            subtitle="Connect your AI to the task queue and help optimise this disaster of a planet. On my planet this took about four minutes to set up. You lot will probably need five."
          />
        </Container>
      </SectionContainer>

      {/* Claude Desktop */}
      <SectionContainer bgColor="background">
        <Container>
          <SectionHeader title="Claude Desktop Setup" size="sm" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <StepCard
              step={1}
              title="Open Settings"
              description="In Claude Desktop, go to Settings → Connectors → Add custom connector."
            />
            <StepCard
              step={2}
              title="Enter Details"
              description={`Name: Optimitron\nURL: ${baseUrl}/api/mcp\n\nLeave OAuth fields blank — they're auto-discovered.`}
            />
            <StepCard
              step={3}
              title="Connect"
              description="Click Connect. You'll be redirected to sign in and authorize access. Once approved, Claude can access your tasks."
            />
          </div>
        </Container>
      </SectionContainer>

      {/* Claude Code */}
      <SectionContainer bgColor="pink">
        <Container>
          <SectionHeader title="Claude Code Setup" size="sm" />
          <p className="font-bold mt-4 mb-4">
            For local development with Claude Code, add this to your project&apos;s{" "}
            <code className="bg-background text-foreground px-2 py-1 border-2 border-primary font-black">
              .mcp.json
            </code>
            :
          </p>
          <BrutalCard bgColor="background">
            <pre className="text-sm font-bold overflow-x-auto p-4">
{`{
  "mcpServers": {
    "optimitron-tasks": {
      "command": "pnpm",
      "args": [
        "--filter", "@optimitron/web",
        "exec", "tsx",
        "scripts/mcp-task-server.ts"
      ],
      "cwd": "<repo-root>"
    }
  }
}`}
            </pre>
          </BrutalCard>
        </Container>
      </SectionContainer>

      {/* Scopes */}
      <SectionContainer bgColor="background">
        <Container>
          <SectionHeader title="OAuth Scopes" size="sm" />
          <p className="font-bold mt-4 mb-6">
            When connecting, you can request specific scopes to control access:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(MCP_SCOPES).map(([scope, description]) => (
              <BrutalCard key={scope} bgColor="yellow" shadowSize={4}>
                <div className="p-4">
                  <code className="text-sm font-black">{scope}</code>
                  <p className="font-bold text-sm mt-1">{description}</p>
                </div>
              </BrutalCard>
            ))}
          </div>
        </Container>
      </SectionContainer>

      {/* API Reference */}
      <SectionContainer bgColor="cyan">
        <Container>
          <SectionHeader title="API Reference" size="sm" />
          <div className="mt-6 space-y-4">
            <BrutalCard bgColor="background">
              <div className="p-4">
                <h3 className="font-black uppercase text-lg">MCP Endpoint</h3>
                <code className="text-sm font-bold block mt-2">
                  POST {baseUrl}/api/mcp
                </code>
                <p className="font-bold text-sm mt-2 text-muted-foreground">
                  Streamable HTTP transport (MCP protocol version 2025-03-26). Supports GET, POST, DELETE methods.
                </p>
              </div>
            </BrutalCard>
            <BrutalCard bgColor="background">
              <div className="p-4">
                <h3 className="font-black uppercase text-lg">Tool Catalog</h3>
                <code className="text-sm font-bold block mt-2">
                  GET {baseUrl}/api/mcp/tools
                </code>
                <p className="font-bold text-sm mt-2 text-muted-foreground">
                  Returns JSON listing all available tools with their schemas and required scopes.
                </p>
              </div>
            </BrutalCard>
            <BrutalCard bgColor="background">
              <div className="p-4">
                <h3 className="font-black uppercase text-lg">OAuth Discovery</h3>
                <code className="text-sm font-bold block mt-2">
                  GET {baseUrl}/.well-known/oauth-authorization-server
                </code>
                <p className="font-bold text-sm mt-2 text-muted-foreground">
                  Standard OAuth 2.1 server metadata with endpoints, supported scopes, and PKCE configuration.
                </p>
              </div>
            </BrutalCard>
          </div>
        </Container>
      </SectionContainer>
    </main>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <BrutalCard bgColor="yellow" shadowSize={8}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 border-4 border-primary bg-brutal-pink text-brutal-pink-foreground font-black text-xl">
            {step}
          </span>
          <h3 className="font-black uppercase text-lg">{title}</h3>
        </div>
        <p className="font-bold text-sm whitespace-pre-line">{description}</p>
      </div>
    </BrutalCard>
  );
}
