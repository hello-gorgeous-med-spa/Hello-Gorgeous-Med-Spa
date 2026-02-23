/**
 * POST /api/face/blueprint
 * HG Face Blueprint™ – AI personalization from selected_services + intensity.
 * Rate limited 5/IP/hour. Zod validated. No prompts/pricing client-side.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import {
  parseBodyWithLimit,
  invalidInputResponse,
  MAX_BODY_SIZE_AI,
  faceBlueprintSchema,
} from "@/lib/api-validation";
import { verifyTurnstileToken } from "@/lib/turnstile";
import type { FaceBlueprintAIOutput, FaceServiceId } from "@/lib/face-types";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_429_MESSAGE = "Too many face blueprint requests. Please try again later.";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const raw = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return raw || "unknown";
}

function getHourTs(): string {
  return new Date().toISOString().slice(0, 13);
}

const SYSTEM_PROMPT = `You are an aesthetic treatment planning assistant for Hello Gorgeous Med Spa.
Generate a short, professional aesthetic summary and recommended priority order based on the user's selected face treatments and intensity.
Do not diagnose. Do not make medical claims. Keep tone supportive and educational.
Output valid JSON only, no markdown or extra text.`;

function buildUserPrompt(params: {
  selected_services: FaceServiceId[];
  intensity_level: string;
  roadmapContext?: string;
}): string {
  const { selected_services, intensity_level, roadmapContext } = params;
  return `Based on this face blueprint request, output a single JSON object with exactly these keys: aesthetic_summary (string, 2-4 sentences), recommended_priority_order (array of strings – same service IDs in suggested order), estimated_investment_range (e.g. "$800 – $2,500" or "To be reviewed during consult"), confidence_message (one short sentence).
Selected services: ${JSON.stringify(selected_services)}
Intensity level: ${intensity_level}
${roadmapContext ? `Roadmap context (for alignment): ${roadmapContext}` : ""}`;
}

function parseAIJson(body: string): FaceBlueprintAIOutput | null {
  const trimmed = body.trim();
  const jsonStr =
    trimmed.startsWith("```") && trimmed.endsWith("```")
      ? trimmed.replace(/^```\w*\n?|\n?```$/g, "").trim()
      : trimmed;
  try {
    const parsed = JSON.parse(jsonStr) as FaceBlueprintAIOutput;
    if (typeof parsed.aesthetic_summary !== "string" || !Array.isArray(parsed.recommended_priority_order)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const bodyResult = await parseBodyWithLimit(request, MAX_BODY_SIZE_AI);
    if (!bodyResult.success) return bodyResult.response;

    const parsed = faceBlueprintSchema.safeParse(bodyResult.data);
    if (!parsed.success) {
      return invalidInputResponse(parsed.error.message, parsed.error.issues);
    }

    const turnstile = await verifyTurnstileToken(parsed.data.turnstile_token);
    if (!turnstile.success) {
      return NextResponse.json(
        { error: turnstile.error ?? "Bot check failed" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    if (supabase) {
      const ip = getClientIp(request);
      const hourTs = getHourTs();
      const { data: count, error: rpcError } = await supabase.rpc("api_rate_limit_inc", {
        p_bucket_key: `face:${ip}`,
        p_hour_ts: hourTs,
      });
      if (rpcError) {
        console.error("face rate limit rpc error", rpcError);
      } else if (typeof count === "number" && count > RATE_LIMIT_MAX) {
        console.warn("[rate-limit] Face blueprint exceeded", {
          ip: ip.slice(0, 8) + "…",
          hourTs,
          count,
        });
        return NextResponse.json(
          { error: RATE_LIMIT_429_MESSAGE },
          { status: 429 }
        );
      }
    }

    let roadmapContext: string | undefined;
    if (parsed.data.roadmap_session_id && supabase) {
      const { data: journey } = await supabase
        .from("journey_sessions")
        .select("ai_summary, recommended_services")
        .eq("id", parsed.data.roadmap_session_id)
        .single();
      if (journey?.ai_summary) {
        roadmapContext = JSON.stringify({
          roadmap: (journey.ai_summary as { roadmap_title?: string })?.roadmap_title,
          recommended_services: journey.recommended_services,
        });
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    let blueprint: FaceBlueprintAIOutput;

    if (apiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: buildUserPrompt({
                selected_services: parsed.data.selected_services,
                intensity_level: parsed.data.intensity_level,
                roadmapContext,
              }),
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.4,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("OpenAI face blueprint error", res.status, errText);
        return NextResponse.json(
          { error: "Aesthetic summary is temporarily unavailable. Please try again later." },
          { status: 502 }
        );
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        return NextResponse.json(
          { error: "Invalid response from aesthetic service." },
          { status: 502 }
        );
      }

      const parsedAI = parseAIJson(content);
      if (!parsedAI) {
        return NextResponse.json(
          { error: "Invalid face blueprint format." },
          { status: 502 }
        );
      }
      blueprint = parsedAI;
    } else {
      blueprint = {
        aesthetic_summary:
          "Your selected treatments are aligned with a personalized approach. A consultation will confirm the best order and investment range for you.",
        recommended_priority_order: parsed.data.selected_services.slice(0, 6),
        estimated_investment_range: "To be reviewed during consult",
        confidence_message:
          "Your blueprint is educational. A licensed provider at Hello Gorgeous will tailor your plan in person.",
      };
    }

    if (supabase) {
      const { data: row, error } = await supabase
        .from("face_sessions")
        .insert({
          roadmap_id: parsed.data.roadmap_session_id ?? null,
          selected_services: parsed.data.selected_services,
          intensity_level: parsed.data.intensity_level,
          consent_given: parsed.data.consent_given ?? false,
          image_hash: parsed.data.image_hash ?? null,
          ai_summary: blueprint,
          conversion_status: "generated",
        })
        .select("id, created_at")
        .single();

      if (error) {
        console.error("face_sessions insert error", error);
      }

      return NextResponse.json({
        session_id: row?.id ?? null,
        aesthetic_summary: blueprint.aesthetic_summary,
        recommended_priority_order: blueprint.recommended_priority_order,
        estimated_investment_range: blueprint.estimated_investment_range,
        confidence_message: blueprint.confidence_message,
      });
    }

    return NextResponse.json({
      session_id: null,
      aesthetic_summary: blueprint.aesthetic_summary,
      recommended_priority_order: blueprint.recommended_priority_order,
      estimated_investment_range: blueprint.estimated_investment_range,
      confidence_message: blueprint.confidence_message,
    });
  } catch (e) {
    console.error("face/blueprint error", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
