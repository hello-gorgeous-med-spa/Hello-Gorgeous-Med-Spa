import { NextRequest, NextResponse } from "next/server";
import { respondRegenMascot } from "@/lib/mascots/regen-mascot-responder";

/** Legacy Peppy endpoint — same free knowledge engine as mascot-chat */
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === "user");
    const userText =
      typeof lastUser?.content === "string" ? lastUser.content : String(lastUser?.content ?? "");

    const { response } = respondRegenMascot("peppy", userText);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Peppy chat error:", error);
    return NextResponse.json(
      {
        response:
          "Oops! I hit a snag. Call (630) 636-6193 — our team is happy to help!",
      },
      { status: 200 },
    );
  }
}
