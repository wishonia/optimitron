import { GoogleGenAI } from '@google/genai';
import type { StructuredReasoner, StructuredReasoningRequest } from './types.js';

export interface GeminiClientLike {
  models: {
    generateContent(input: {
      model: string;
      contents: string;
      config: {
        maxOutputTokens?: number;
        responseJsonSchema: Record<string, unknown>;
        responseMimeType: 'application/json';
        temperature?: number;
      };
    }): Promise<{ text?: string | (() => string) }>;
  };
}

export interface GeminiReasonerOptions {
  apiKey: string;
  client?: GeminiClientLike;
  maxOutputTokens?: number;
  model?: string;
  temperature?: number;
}

function responseText(response: { text?: string | (() => string) }): string {
  if (typeof response.text === 'function') {
    return response.text();
  }

  if (typeof response.text === 'string') {
    return response.text;
  }

  throw new Error('Gemini response did not contain text output');
}

export function createGeminiClient(apiKey: string): GeminiClientLike {
  return new GoogleGenAI({ apiKey }) as unknown as GeminiClientLike;
}

export function createGeminiReasoner(
  options: GeminiReasonerOptions,
): StructuredReasoner {
  const client = options.client ?? createGeminiClient(options.apiKey);
  const model = options.model ?? 'gemini-3-flash-preview';
  const temperature = options.temperature ?? 0.1;
  const maxOutputTokens = options.maxOutputTokens ?? 4096;

  return {
    async generateObject<T>(
      request: StructuredReasoningRequest<T>,
    ): Promise<T> {
      const response = await client.models.generateContent({
        model,
        contents: request.prompt,
        config: {
          temperature,
          maxOutputTokens,
          responseMimeType: 'application/json',
          responseJsonSchema: request.responseJsonSchema,
        },
      });

      const parsed = JSON.parse(responseText(response)) as unknown;
      return request.parse(parsed);
    },
  };
}

export interface AskGeminiOptions {
  prompt: string;
  apiKey?: string;
  model?: string;
}

export function resolveGeminiApiKey(apiKey?: string): string {
  const resolvedApiKey = apiKey
    ?? process.env['GOOGLE_GENERATIVE_AI_API_KEY']
    ?? process.env['GOOGLE_API_KEY'];

  if (!resolvedApiKey) {
    throw new Error(
      'No Gemini API key: set GOOGLE_GENERATIVE_AI_API_KEY, GOOGLE_API_KEY, or pass apiKey',
    );
  }

  return resolvedApiKey;
}

/**
 * Simple convenience wrapper for unstructured text responses from Gemini.
 * Uses GOOGLE_GENERATIVE_AI_API_KEY or GOOGLE_API_KEY env vars if apiKey not provided.
 */
export async function askGemini(options: AskGeminiOptions): Promise<string> {
  const apiKey = resolveGeminiApiKey(options.apiKey);
  const client = createGeminiClient(apiKey);
  const model = options.model ?? 'gemini-3-flash-preview';

  const response = await (client as unknown as {
    models: {
      generateContent(input: { model: string; contents: string }): Promise<{ text?: string | (() => string) }>;
    };
  }).models.generateContent({
    model,
    contents: options.prompt,
  });

  return responseText(response);
}
