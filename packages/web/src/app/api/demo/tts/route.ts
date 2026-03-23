import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GOOGLE_API_KEY;

/**
 * POST /api/demo/tts
 * Body: { text: string, slideId?: string }
 * Returns: audio/wav
 *
 * Uses Gemini TTS (Kore voice — authoritative female, closest to Wishonia)
 * to generate speech from narration text.
 */
export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "No Gemini API key configured" },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { text?: string };
  if (!body.text || typeof body.text !== "string") {
    return NextResponse.json(
      { error: "Missing 'text' field" },
      { status: 400 },
    );
  }

  try {
    const client = new GoogleGenAI({ apiKey });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          role: "user",
          parts: [{ text: body.text }],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore",
            },
          },
        },
      },
    } as Parameters<typeof client.models.generateContent>[0]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Gemini TTS response shape not fully typed
    const raw = response as any;
    const candidate = raw.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(
      (p: any) => p.inlineData?.mimeType?.startsWith("audio/"),
    );

    if (!audioPart?.inlineData?.data) {
      return NextResponse.json(
        { error: "No audio in Gemini response" },
        { status: 502 },
      );
    }

    const audioBuffer = Buffer.from(audioPart.inlineData.data, "base64");
    const mimeType = audioPart.inlineData.mimeType ?? "audio/wav";

    // If raw PCM, wrap in WAV header (24kHz, 16-bit, mono)
    let finalBuffer = audioBuffer;
    let finalMime = mimeType;

    if (mimeType.includes("L16") || mimeType.includes("pcm")) {
      const sampleRate = 24000;
      const bitsPerSample = 16;
      const channels = 1;
      const byteRate = sampleRate * channels * (bitsPerSample / 8);
      const blockAlign = channels * (bitsPerSample / 8);
      const dataSize = audioBuffer.length;
      const header = Buffer.alloc(44);
      header.write("RIFF", 0);
      header.writeUInt32LE(36 + dataSize, 4);
      header.write("WAVE", 8);
      header.write("fmt ", 12);
      header.writeUInt32LE(16, 16);
      header.writeUInt16LE(1, 20);
      header.writeUInt16LE(channels, 22);
      header.writeUInt32LE(sampleRate, 24);
      header.writeUInt32LE(byteRate, 28);
      header.writeUInt16LE(blockAlign, 32);
      header.writeUInt16LE(bitsPerSample, 34);
      header.write("data", 36);
      header.writeUInt32LE(dataSize, 40);
      finalBuffer = Buffer.concat([header, audioBuffer]);
      finalMime = "audio/wav";
    }

    return new NextResponse(finalBuffer, {
      headers: {
        "Content-Type": finalMime,
        "Content-Length": String(finalBuffer.length),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
