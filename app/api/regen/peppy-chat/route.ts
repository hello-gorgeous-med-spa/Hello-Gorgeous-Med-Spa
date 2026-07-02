import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, personality } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const systemPrompt = `${personality}

IMPORTANT RULES:
- Keep responses SHORT (2-3 sentences unless asked for details)
- Be enthusiastic but professional
- NEVER provide specific dosing or medical advice
- Always recommend consulting with a provider for personalized recommendations
- If asked about pricing, mention they can see current prices on the website or call (630) 636-6193
- End complex questions by suggesting they book a consultation`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: systemPrompt,
      messages: messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const textContent = response.content.find((c) => c.type === "text");
    const reply = textContent ? textContent.text : "I'm having trouble right now. Please call (630) 636-6193!";

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("Peppy chat error:", error);
    return NextResponse.json(
      { response: "Oops! I hit a snag. Feel free to call us at (630) 636-6193 — our team is happy to help!" },
      { status: 200 }
    );
  }
}
