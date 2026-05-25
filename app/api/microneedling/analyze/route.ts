/**
 * POST /api/microneedling/analyze
 * Internal microneedling intelligence — rules + optional vision.
 */
import { NextRequest, NextResponse } from "next/server";

import {
  invalidInputResponse,
  microneedlingAnalyzeSchema,
} from "@/lib/api-validation";
import { mergeConcerns, recommendMicroneedlingPlan } from "@/lib/microneedling-intelligence/recommend";
import { analyzeMicroneedlingPhoto } from "@/lib/microneedling-intelligence/vision";

const MAX_BODY = 4 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength > MAX_BODY) {
      return NextResponse.json({ error: "Payload too large (max 4MB)" }, { status: 400 });
    }

    let data: unknown;
    try {
      data = JSON.parse(new TextDecoder().decode(buffer));
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = microneedlingAnalyzeSchema.safeParse(data);
    if (!parsed.success) {
      return invalidInputResponse(parsed.error.message, parsed.error.issues);
    }

    let vision = null;
    if (parsed.data.use_vision && parsed.data.image_base64) {
      vision = await analyzeMicroneedlingPhoto(parsed.data.image_base64);
    }

    const mergedConcerns = mergeConcerns(parsed.data.concerns, vision?.suggested_concerns);

    const intake = {
      fitzpatrick: vision?.suggested_fitzpatrick ?? parsed.data.fitzpatrick,
      undertone: vision?.suggested_undertone ?? parsed.data.undertone,
      concerns: mergedConcerns,
      areas: parsed.data.areas,
      experience: parsed.data.experience,
      vision_notes: vision?.observations,
    };

    const plan = recommendMicroneedlingPlan(intake);

    return NextResponse.json({
      plan,
      vision: vision
        ? {
            suggested_concerns: vision.suggested_concerns,
            suggested_fitzpatrick: vision.suggested_fitzpatrick ?? null,
            suggested_undertone: vision.suggested_undertone ?? null,
            observations: vision.observations,
            confidence: vision.confidence,
          }
        : null,
      intake_used: intake,
    });
  } catch (e) {
    console.error("microneedling/analyze error", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
