import { z } from 'zod';
import { describe, expect, it, vi } from 'vitest';
import {
  askGemini,
  createGeminiClient,
  createGeminiReasoner,
  resolveGeminiApiKey,
} from '../gemini.js';

describe('gemini helpers', () => {
  it('creates a Gemini client facade', () => {
    const client = createGeminiClient('test-key');

    expect(client).toHaveProperty('models');
    expect(client.models).toHaveProperty('generateContent');
  });

  it('generates structured JSON objects via the injected client', async () => {
    const generateContent = vi.fn().mockResolvedValue({
      text: () => '{"decision":"proceed"}',
    });
    const reasoner = createGeminiReasoner({
      apiKey: 'test-key',
      client: {
        models: {
          generateContent,
        },
      },
      model: 'gemini-test',
      temperature: 0.2,
      maxOutputTokens: 256,
    });

    const schema = z.object({
      decision: z.enum(['proceed']),
    });
    const result = await reasoner.generateObject({
      schemaName: 'Decision',
      prompt: 'Return a JSON decision.',
      responseJsonSchema: {
        type: 'object',
        required: ['decision'],
        properties: {
          decision: {
            type: 'string',
          },
        },
      },
      parse: (value) => schema.parse(value),
    });

    expect(result).toEqual({
      decision: 'proceed',
    });
    expect(generateContent).toHaveBeenCalledWith({
      model: 'gemini-test',
      contents: 'Return a JSON decision.',
      config: {
        temperature: 0.2,
        maxOutputTokens: 256,
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          required: ['decision'],
          properties: {
            decision: {
              type: 'string',
            },
          },
        },
      },
    });
  });

  it('repairs common JSON formatting issues in structured responses', async () => {
    const generateContent = vi.fn().mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              {
                text: '{\n  "summary": "Line one\nLine two",\n  "decision": "proceed"\n}',
              },
            ],
          },
        },
      ],
    });
    const reasoner = createGeminiReasoner({
      apiKey: 'test-key',
      client: {
        models: {
          generateContent,
        },
      },
    });

    const schema = z.object({
      summary: z.string(),
      decision: z.enum(['proceed']),
    });
    const result = await reasoner.generateObject({
      schemaName: 'DecisionWithSummary',
      prompt: 'Return JSON only.',
      responseJsonSchema: {
        type: 'object',
        required: ['summary', 'decision'],
        properties: {
          summary: {
            type: 'string',
          },
          decision: {
            type: 'string',
          },
        },
      },
      parse: (value) => schema.parse(value),
    });

    expect(result.summary).toContain('Line one');
    expect(result.summary).toContain('Line two');
    expect(result.decision).toBe('proceed');
  });

  it('throws when no API key is available for askGemini', async () => {
    const original = process.env['GOOGLE_GENERATIVE_AI_API_KEY'];
    const fallback = process.env['GOOGLE_API_KEY'];
    delete process.env['GOOGLE_GENERATIVE_AI_API_KEY'];
    delete process.env['GOOGLE_API_KEY'];

    try {
      await expect(askGemini({ prompt: 'hello' })).rejects.toThrow('No Gemini API key');
    } finally {
      if (original !== undefined) {
        process.env['GOOGLE_GENERATIVE_AI_API_KEY'] = original;
      }
      if (fallback !== undefined) {
        process.env['GOOGLE_API_KEY'] = fallback;
      }
    }
  });

  it('resolves GOOGLE_API_KEY as a fallback', () => {
    const original = process.env['GOOGLE_GENERATIVE_AI_API_KEY'];
    const fallback = process.env['GOOGLE_API_KEY'];
    delete process.env['GOOGLE_GENERATIVE_AI_API_KEY'];
    process.env['GOOGLE_API_KEY'] = 'fallback-key';

    try {
      expect(resolveGeminiApiKey()).toBe('fallback-key');
    } finally {
      if (original !== undefined) {
        process.env['GOOGLE_GENERATIVE_AI_API_KEY'] = original;
      }
      if (fallback !== undefined) {
        process.env['GOOGLE_API_KEY'] = fallback;
      } else {
        delete process.env['GOOGLE_API_KEY'];
      }
    }
  });
});
