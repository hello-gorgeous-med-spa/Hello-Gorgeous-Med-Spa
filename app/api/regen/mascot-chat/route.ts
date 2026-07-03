import { NextRequest, NextResponse } from "next/server";
import {
  isValidRegenMascotId,
  respondRegenMascot,
} from "@/lib/mascots/regen-mascot-responder";

/**
 * RE GEN mascot chat — free rule-based knowledge (no Anthropic/OpenAI).
 * Knowledge lives in lib/mascots/hg-regen-knowledge.ts
 */
export async function POST(req: NextRequest) {
  try {
    const { mascotId, messages } = await req.json();

    if (!mascotId || !isValidRegenMascotId(mascotId)) {
      return NextResponse.json({ error: "Invalid mascot ID" }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === "user");
    const userText =
      typeof lastUser?.content === "string" ? lastUser.content : String(lastUser?.content ?? "");

    const { response } = respondRegenMascot(mascotId, userText);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Mascot chat error:", error);
    return NextResponse.json(
      {
        response:
          "Oops! I hit a snag. Call (630) 636-6193 or shop at hellogorgeousmedspa.com/rx — our team is happy to help!",
      },
      { status: 200 },
    );
  }
}
