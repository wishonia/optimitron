import { NextResponse, type NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { RAG_MODEL } from '@/lib/voice-config';

interface RAGRequestBody {
  query: string;
}

/**
 * POST /api/voice/rag
 *
 * Retrieves context from the Gemini FileSearchStore for RAG grounding.
 * Called by the client when the Live API model invokes the retrieveContext tool.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GOOGLE_GENERATIVE_AI_API_KEY not configured' },
      { status: 500 },
    );
  }

  const storeId = process.env.GEMINI_FILE_SEARCH_STORE_ID;

  let body: RAGRequestBody;
  try {
    body = (await request.json()) as RAGRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.query || typeof body.query !== 'string') {
    return NextResponse.json({ error: 'Missing required field: query' }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // If a FileSearchStore is configured, use it for grounding
    if (storeId) {
      const response = await ai.models.generateContent({
        model: RAG_MODEL,
        contents: [
          {
            role: 'user',
            parts: [{ text: body.query }],
          },
        ],
        config: {
          tools: [
            {
              retrieval: {
                vertexRagStore: {
                  ragCorpora: [storeId],
                },
              },
            },
          ],
        },
      });

      const text = response.text ?? '';
      const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

      return NextResponse.json({ context: text, citations });
    }

    // Fallback: no FileSearchStore configured — use plain generation
    const response = await ai.models.generateContent({
      model: RAG_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are a knowledge retrieval assistant for the Optomitron platform. Answer the following query concisely with specific data and citations where possible:\n\n${body.query}`,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      context: response.text ?? 'No relevant context found.',
      citations: [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'RAG retrieval failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
