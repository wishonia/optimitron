import { FunctionCallingConfigMode, GoogleGenAI } from '@google/genai';
import type { StructuredReasoner, StructuredReasoningRequest } from './types.js';

export interface GeminiFunctionCallLike {
  args?: Record<string, unknown>;
  name?: string;
}

export interface GeminiGenerateContentResponseLike {
  text?: string | (() => string);
  functionCalls?: GeminiFunctionCallLike[];
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export interface GeminiClientLike {
  models: {
    generateContent(input: {
      model: string;
      contents: string;
      config: {
        maxOutputTokens?: number;
        temperature?: number;
        tools?: Array<Record<string, unknown>>;
        toolConfig?: {
          includeServerSideToolInvocations?: boolean;
          functionCallingConfig?: {
            allowedFunctionNames?: string[];
            mode?: FunctionCallingConfigMode;
          };
        };
      };
    }): Promise<GeminiGenerateContentResponseLike>;
  };
}

export interface GeminiReasonerOptions {
  apiKey: string;
  client?: GeminiClientLike;
  maxOutputTokens?: number;
  model?: string;
  temperature?: number;
}

function shouldRetryGeminiError(error: unknown): boolean {
  return error instanceof Error && /503|unavailable|high demand|overloaded/i.test(error.message);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolvePromise) => {
    setTimeout(resolvePromise, ms);
  });
}

export function responseText(response: GeminiGenerateContentResponseLike): string {
  if (typeof response.text === 'function') {
    const text = response.text();
    if (text.length > 0) {
      return text;
    }
  }

  if (typeof response.text === 'string') {
    if (response.text.length > 0) {
      return response.text;
    }
  }

  const candidateText = (response as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  }).candidates
    ?.flatMap(candidate => candidate.content?.parts ?? [])
    .map(part => part.text ?? '')
    .join('')
    .trim();

  if (candidateText && candidateText.length > 0) {
    return candidateText;
  }

  throw new Error('Gemini response did not contain text output');
}

function sanitizeFunctionName(schemaName: string): string {
  const normalized = schemaName
    .replace(/[^A-Za-z0-9_.:-]+/g, '_')
    .replace(/^[^A-Za-z_]+/, '_');

  return normalized.slice(0, 64) || 'structured_output';
}

function extractFunctionCallArgs(
  response: GeminiGenerateContentResponseLike,
  functionName: string,
): Record<string, unknown> | null {
  const matchingCall = response.functionCalls?.find(
    functionCall => functionCall.name === functionName && functionCall.args,
  );

  return matchingCall?.args ?? null;
}

function stripMarkdownFences(text: string): string {
  const trimmed = text.trim();

  if (!trimmed.startsWith('```')) {
    return trimmed;
  }

  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

function sliceLikelyJson(text: string): string {
  const trimmed = stripMarkdownFences(text);
  const objectStart = trimmed.indexOf('{');
  const objectEnd = trimmed.lastIndexOf('}');

  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    return trimmed.slice(objectStart, objectEnd + 1);
  }

  const arrayStart = trimmed.indexOf('[');
  const arrayEnd = trimmed.lastIndexOf(']');

  if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
    return trimmed.slice(arrayStart, arrayEnd + 1);
  }

  return trimmed;
}

function repairJsonString(text: string): string {
  let result = '';
  let inString = false;
  let escaping = false;

  for (const char of text) {
    if (inString) {
      if (escaping) {
        result += char;
        escaping = false;
        continue;
      }

      if (char === '\\') {
        result += char;
        escaping = true;
        continue;
      }

      if (char === '"') {
        result += char;
        inString = false;
        continue;
      }

      if (char === '\n') {
        result += '\\n';
        continue;
      }

      if (char === '\r') {
        result += '\\r';
        continue;
      }

      if (char === '\t') {
        result += '\\t';
        continue;
      }

      result += char;
      continue;
    }

    if (char === '"') {
      inString = true;
    }

    result += char;
  }

  return result;
}

export function parseJsonResponse(text: string): unknown {
  const sliced = sliceLikelyJson(text);

  try {
    return JSON.parse(sliced) as unknown;
  } catch (initialError) {
    const repaired = repairJsonString(sliced);

    if (repaired !== sliced) {
      return JSON.parse(repaired) as unknown;
    }

    throw initialError;
  }
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
      const functionName = sanitizeFunctionName(request.schemaName);
      let lastError: unknown;

      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const response = await client.models.generateContent({
            model,
            contents: request.prompt,
            config: {
              temperature,
              maxOutputTokens,
              tools: [{
                functionDeclarations: [{
                  name: functionName,
                  description: `Return the ${request.schemaName} object.`,
                  parametersJsonSchema: request.responseJsonSchema,
                }],
              }],
              toolConfig: {
                functionCallingConfig: {
                  mode: FunctionCallingConfigMode.ANY,
                  allowedFunctionNames: [functionName],
                },
              },
            },
          });

          const parsed = extractFunctionCallArgs(response, functionName)
            ?? parseJsonResponse(responseText(response));
          return request.parse(parsed);
        } catch (error) {
          lastError = error;

          if (!shouldRetryGeminiError(error) || attempt === 3) {
            break;
          }

          await sleep(1500 * attempt);
        }
      }

      throw lastError;
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
