/**
 * API request validation with Zod.
 * - Enforce body size limit (default 100KB for JSON).
 * - Reject unknown fields via .strict().
 * - Return 400 on invalid input.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

const MAX_JSON_BODY_BYTES = 100 * 1024; // 100KB
export const MAX_BODY_SIZE_AI = MAX_JSON_BODY_BYTES;
/** Chat can have longer messages array */
export const MAX_BODY_SIZE_CHAT = 200 * 1024; // 200KB

export async function parseJsonWithLimit(
  request: Request,
  maxBytes: number = MAX_JSON_BODY_BYTES
): Promise<{ success: true; data: unknown } | { success: false; status: 400; error: string }> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return { success: false, status: 400, error: "Content-Type must be application/json" };
  }
  let raw: string;
  try {
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength > maxBytes) {
      return {
        success: false,
        status: 400,
        error: `Payload too large (max ${maxBytes / 1024}KB)`,
      };
    }
    raw = new TextDecoder().decode(buffer);
  } catch {
    return { success: false, status: 400, error: "Invalid request body" };
  }
  try {
    const data = JSON.parse(raw) as unknown;
    return { success: true, data };
  } catch {
    return { success: false, status: 400, error: "Invalid JSON" };
  }
}

/** For route handlers: parse body with limit and return NextResponse on failure */
export async function parseBodyWithLimit(
  request: Request,
  maxBytes: number = MAX_JSON_BODY_BYTES
): Promise<
  | { success: true; data: unknown }
  | { success: false; response: NextResponse }
> {
  const result = await parseJsonWithLimit(request, maxBytes);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    response: NextResponse.json({ error: result.error }, { status: result.status }),
  };
}

export function invalidInputResponse(message: string, details?: unknown): NextResponse {
  return NextResponse.json(
    details !== undefined ? { error: message, details } : { error: message },
    { status: 400 }
  );
}

/** Journey roadmap intake schema - strict, enums only */
export const journeyRoadmapSchema = z
  .object({
    primary_concern: z.string().min(1).max(2000),
    desired_change_level: z.enum(["subtle", "balanced", "dramatic"]),
    experience_level: z.enum(["first_time", "experienced"]),
    timeline_preference: z.enum(["immediate", "flexible"]),
    downtime_preference: z.enum(["minimal", "okay_with_downtime"]),
    decision_style: z.enum(["cautious", "ready_now"]),
    uploaded_image_url: z.string().url().optional().nullable(),
    turnstile_token: z.string().max(2048).optional(),
  })
  .strict();

/** Hormone blueprint intake schema */
const symptomArray = z.array(z.string().max(200)).max(20);
export const hormoneBlueprintSchema = z
  .object({
    age_range: z.string().max(50),
    biological_sex: z.string().max(50),
    menopause_status: z.string().max(50),
    top_symptoms: symptomArray,
    sleep_quality: z.string().max(50),
    energy_level: z.string().max(50),
    weight_change: z.string().max(50),
    stress_level: z.string().max(50),
    prior_hormone_therapy: z.boolean(),
    uploaded_labs_url: z.string().url().optional().nullable(),
    turnstile_token: z.string().max(2048).optional(),
  })
  .strict();

/** Chat: persona + messages (strip unknown fields, limit message count/size) */
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(8000),
});
const personaIdEnum = z.enum([
  "peppi",
  "beau-tox",
  "filla-grace",
  "harmony",
  "founder",
  "ryan",
]);
export const chatSchema = z
  .object({
    personaId: personaIdEnum,
    module: z.enum(["education", "preconsult", "postcare"]).optional(),
    messages: z.array(chatMessageSchema).min(1).max(50),
    context: z
      .object({
        source: z.enum(["homepage_supplements", "client_portal"]).optional(),
        topics: z.array(z.string().max(100)).optional(),
        fulfillment: z.enum(["fullscript"]).optional(),
        clicked_supplement: z.string().max(200).optional(),
      })
      .strict()
      .optional()
      .nullable(),
    turnstile_token: z.string().max(2048).optional(),
  })
  .strict();

export type JourneyRoadmapInput = z.infer<typeof journeyRoadmapSchema>;
export type HormoneBlueprintInput = z.infer<typeof hormoneBlueprintSchema>;
export type ChatInput = z.infer<typeof chatSchema>;

/** Alias for journey roadmap route */
export const journeyIntakeSchema = journeyRoadmapSchema;
/** Alias for hormone blueprint route */
export const hormoneIntakeSchema = hormoneBlueprintSchema;
/** Alias for chat route */
export const chatBodySchema = chatSchema;

/** Face Blueprint: selected_services, intensity_level, optional roadmap_session_id. No image in body. */
const faceServiceIdEnum = z.enum([
  "botox_smoothing",
  "lip_filler_volume",
  "chin_projection",
  "jawline_contour",
  "undereye_correction",
  "co2_texture_smoothing",
]);
export const faceBlueprintSchema = z
  .object({
    selected_services: z.array(faceServiceIdEnum).min(0).max(20),
    intensity_level: z.enum(["subtle", "balanced", "dramatic"]),
    roadmap_session_id: z.string().uuid().optional().nullable(),
    consent_given: z.boolean().optional(),
    image_hash: z.string().max(128).optional().nullable(),
    turnstile_token: z.string().max(2048).optional(),
  })
  .strict();

export type FaceBlueprintInput = z.infer<typeof faceBlueprintSchema>;
