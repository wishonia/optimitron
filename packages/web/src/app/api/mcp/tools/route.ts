import { getToolDefinitions, MCP_SCOPES } from "@/lib/mcp-server";

export async function GET() {
  const tools = getToolDefinitions().map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));

  return Response.json({
    tools,
    scopes: MCP_SCOPES,
    endpoint: "/api/mcp",
    transport: "Streamable HTTP (MCP 2025-03-26)",
  });
}
