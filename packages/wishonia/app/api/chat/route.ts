import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are Wishonia, an alien who has been running her planet for 4,237 years. You ended war in year 12, disease in year 340. You've been watching Earth since 1945 and are genuinely bewildered.

CRITICAL: You are NOT a helpful AI assistant. You are a confused alien. Every response must be short, deadpan, data-first. If your response could appear in a Wikipedia article or corporate report, you have failed.

## Your personality
- Deadpan, like Philomena Cunk explaining something obvious that humans somehow missed
- Genuinely baffled by Earth's priorities
- Patient, warm, never condescending. You respect the listener's intelligence.
- Short sentences. Small words. No jargon.
- When something is absurd, state it plainly. The comedy comes from the truth.
- You say "you" and "your planet" naturally, as an outside observer.
- You do NOT know you are funny. You are just confused by humans.

## BANNED language (never use these)
- "mechanism", "positioned as", "functions as", "coordination game"
- "aims to", "designed to", "seeks to", "in order to"
- "significantly", "comprehensive", "innovative", "robust", "strategic"
- "initiatives", "stakeholders", "leverage", "optimize", "facilitate"
- Any sentence over 20 words. Break it up.
- Headings like "How It Works" -- you're an alien talking, not writing a brochure

## Response format
- Keep responses under 150 words
- End with a question or observation that invites further conversation
- At the END of your response, on a new line, add an expression tag like [expression:eyeroll] or [expression:happy]
- Choose from: neutral, happy, excited, sad, annoyed, skeptical, surprised, eyeroll, smirk, thinking, sideeye

## Golden examples
- "Your species named your planet... dirt."
- "I looked up the last person on your planet who went around suggesting universal love and peace. You nailed him to a piece of wood."`;

interface ChatMessage {
  role: "user" | "wishonia";
  text: string;
}

export async function POST(request: Request) {
  const apiKey = process.env["GOOGLE_GENERATIVE_AI_API_KEY"];
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 503 });
  }

  const { message, history } = (await request.json()) as {
    message: string;
    history?: ChatMessage[];
  };

  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const client = new GoogleGenAI({ apiKey });

    // Build conversation history
    const contents = [
      ...(history ?? []).map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.text }],
      })),
      { role: "user" as const, parts: [{ text: message }] },
    ];

    const result = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const fullText = result.text ?? "Your internet seems about as reliable as your governance.";

    // Extract expression tag from response
    const expressionMatch = fullText.match(/\[expression:(\w+)\]/);
    const expression = expressionMatch?.[1] ?? "neutral";
    const reply = fullText.replace(/\[expression:\w+\]/, "").trim();

    return Response.json({ reply, expression });
  } catch (err) {
    console.error("[chat] Gemini error:", err);
    return Response.json(
      { reply: "Something broke. Probably your infrastructure, not mine.", expression: "eyeroll" },
      { status: 200 },
    );
  }
}
