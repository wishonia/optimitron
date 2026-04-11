/**
 * MCP Server for the Optimitron Task System (stdio transport)
 *
 * Used by Claude Code and local MCP clients. For remote HTTP access,
 * use the /api/mcp endpoint instead.
 *
 * Usage:
 *   npx tsx packages/web/scripts/mcp-task-server.ts
 *
 * Configure in .mcp.json:
 *   {
 *     "mcpServers": {
 *       "optimitron-tasks": {
 *         "command": "pnpm",
 *         "args": ["--filter", "@optimitron/web", "exec", "tsx", "scripts/mcp-task-server.ts"],
 *         "cwd": "<repo-root>"
 *       }
 *     }
 *   }
 */

import "./load-env";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "../src/lib/mcp-server";

const server = createMcpServer();
const transport = new StdioServerTransport();
void server.connect(transport);
