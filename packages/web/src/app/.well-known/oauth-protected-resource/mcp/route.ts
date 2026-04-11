import { getProtectedResourceMetadata } from "@/lib/mcp-oauth";

export async function GET() {
  return Response.json(getProtectedResourceMetadata());
}
