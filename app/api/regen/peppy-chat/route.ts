import { NextRequest, NextResponse } from "next/server";

import { runPeppy, type PeppyMessage } from "@/lib/regen/peppy";

/** Legacy client endpoint — same Peppy brain, public surface only. */
export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages?: PeppyMessage[] };
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }
    const { reply, source } = await runPeppy({ surface: "client", messages });
    return NextResponse.json({ response: reply, source });
  } catch (error) {
    console.error("Peppy chat error:", error);
    return NextResponse.json({
      response: "Oops! I hit a snag. Call (630) 636-6193 — our team is happy to help!",
      source: "fallback",
    });
  }
}
