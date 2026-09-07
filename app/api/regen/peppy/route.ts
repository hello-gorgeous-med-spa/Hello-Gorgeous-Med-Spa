import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { runPeppy, type PeppyMessage, type PeppySurface } from "@/lib/regen/peppy";
import { OPS_SESSION_COOKIE, verifyOpsSessionToken } from "@/lib/regen/ops-session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: PeppyMessage[]; surface?: PeppySurface };
    const surface: PeppySurface = body.surface === "ops" ? "ops" : "client";
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    let staffName: string | undefined;
    if (surface === "ops") {
      const token = (await cookies()).get(OPS_SESSION_COOKIE)?.value;
      const staff = await verifyOpsSessionToken(token);
      if (!staff) {
        return NextResponse.json({ error: "Staff sign-in required" }, { status: 401 });
      }
      staffName = staff.name;
    }

    const { reply, source } = await runPeppy({ surface, messages, staffName });
    return NextResponse.json({ response: reply, source });
  } catch (error) {
    console.error("[peppy] route", error);
    return NextResponse.json(
      {
        response:
          "I hit a snag. Call (630) 636-6193 or open /ops/playbook if you are staff.",
        source: "fallback",
      },
      { status: 200 },
    );
  }
}
