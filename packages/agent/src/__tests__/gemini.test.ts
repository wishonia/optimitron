import { z } from 'zod';
import { describe, expect, it, vi } from 'vitest';
import { createGeminiClient, createGeminiReasoner } from '../gemini.js';

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
});
