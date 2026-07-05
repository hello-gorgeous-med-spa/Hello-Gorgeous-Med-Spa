import { NextResponse } from "next/server";

import {
  parseFlowWavePublicIntake,
  submitFlowWavePublicIntake,
} from "@/lib/flowwave-public-intake";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const payload = parseFlowWavePublicIntake(body);

    if (!payload) {
      return NextResponse.json(
        { error: "Please complete all required fields and consent." },
        { status: 400 },
      );
    }

    const result = await submitFlowWavePublicIntake(payload);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    if (result.intakeId === "spam") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({
      success: true,
      intakeId: result.intakeId,
      screening: result.screening,
    });
  } catch (error) {
    console.error("[flowwave/intake]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please call (630) 636-6193." },
      { status: 500 },
    );
  }
}
