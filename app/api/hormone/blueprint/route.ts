/**
 * POST /api/hormone/blueprint
 * Harmony AI™ – hormone assessment intake → AI blueprint. Rate limited 5/IP/hour.
 * Validated with Zod; no AI call before validation passes.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import {
  parseBodyWithLimit,
  invalidInputResponse,
  MAX_BODY_SIZE_AI,
  hormoneIntakeSchema,
} from "@/lib/api-validation";
import { verifyTurnstileToken } from "@/lib/turnstile";
import type {
  HormoneIntake,
  HormoneBlueprintOutput,
  ProtocolItem,
} from "@/lib/hormone-types";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_429_MESSAGE = "Too many hormone blueprint requests. Please try again later.";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const raw = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return raw || "unknown";
}

function getHourTs(): string {
  return new Date().toISOString().slice(0, 13);
}

const SYSTEM_PROMPT = `You are a medical hormone optimization assistant for Hello Gorgeous Med Spa.
Generate structured, medically responsible educational hormone insights.
Do not diagnose. Do not claim medical certainty.
Provide balanced, ethical recommendations.
Output valid JSON only, no markdown or extra text.`;

const USER_PROMPT_TEMPLATE = (intake: HormoneIntake) =>
  `Based on this intake, output a single JSON object with exactly these keys: blueprint_title, likely_patterns (array of strings), severity_score (integer 0-100), recommended_labs (array of lab names), recommended_protocol (array of { therapy, reason }), timeline_expectation, estimated_investment_range (e.g. "$800 - $2,000"), confidence_message.
Intake:
${JSON.stringify(intake)}`;

function parseAIJson(body: string): HormoneBlueprintOutput | null {
  const trimmed = body.trim();
  const jsonStr =
    trimmed.startsWith("```") && trimmed.endsWith("```")
      ? trimmed.replace(/^```\w*\n?|\n?```$/g, "").trim()
      : trimmed;
  try {
    return JSON.parse(jsonStr) as HormoneBlueprintOutput;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const bodyResult = await parseBodyWithLimit(request, MAX_BODY_SIZE_AI);
    if (!bodyResult.success) return bodyResult.response;
    const parsed = hormoneIntakeSchema.safeParse(bodyResult.data);
    if (!parsed.success) {
      return invalidInputResponse(parsed.error.message, parsed.error.issues);
    }

    const turnstile = await verifyTurnstileToken(parsed.data.turnstile_token);
    if (!turnstile.success) {
      return NextResponse.json({ error: turnstile.error ?? "Bot check failed" }, { status: 400 });
    }

    const intake: HormoneIntake = {
      age_range: parsed.data.age_range,
      biological_sex: parsed.data.biological_sex,
      menopause_status: parsed.data.menopause_status,
      top_symptoms: parsed.data.top_symptoms,
      sleep_quality: parsed.data.sleep_quality,
      energy_level: parsed.data.energy_level,
      weight_change: parsed.data.weight_change,
      stress_level: parsed.data.stress_level,
      prior_hormone_therapy: parsed.data.prior_hormone_therapy,
    };

    const supabase = getSupabase();

    if (supabase) {
      const ip = getClientIp(request);
      const hourTs = getHourTs();
      const { data: count, error: rpcError } = await supabase.rpc("hormone_rate_limit_inc", {
        p_ip: ip,
        p_hour_ts: hourTs,
      });
      if (rpcError) {
        console.error("hormone rate limit rpc error", rpcError);
      } else if (typeof count === "number" && count > RATE_LIMIT_MAX) {
        console.warn("[rate-limit] Hormone blueprint exceeded", { ip: ip.slice(0, 8) + "…", hourTs, count });
        return NextResponse.json(
          { error: RATE_LIMIT_429_MESSAGE },
          { status: 429 }
        );
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    let blueprint: HormoneBlueprintOutput;

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
            { role: "user", content: USER_PROMPT_TEMPLATE(intake) },
          ],
          response_format: { type: "json_object" },
          temperature: 0.4,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("OpenAI hormone error", res.status, errText);
        return NextResponse.json(
          { error: "Hormone insight service is temporarily unavailable. Please try again later." },
          { status: 502 }
        );
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        return NextResponse.json(
          { error: "Invalid response from hormone insight service." },
          { status: 502 }
        );
      }

      const parsed = parseAIJson(content);
      if (!parsed || typeof parsed.severity_score !== "number") {
        return NextResponse.json(
          { error: "Invalid hormone blueprint format." },
          { status: 502 }
        );
      }
      blueprint = parsed;
    } else {
      blueprint = {
        blueprint_title: "Your Hormone Optimization Blueprint",
        likely_patterns: ["Hormone balance assessment recommended"],
        severity_score: 50,
        recommended_labs: ["Total Testosterone", "Estradiol", "Progesterone", "TSH", "Vitamin D"],
        recommended_protocol: [
          { therapy: "BioTE Pellet Therapy", reason: "Personalized hormone optimization based on your symptoms and goals." },
        ],
        timeline_expectation: "2–8 weeks initial stabilization, 3 months full recalibration",
        estimated_investment_range: "To be reviewed at consultation",
        confidence_message: "You are not broken. Your body is asking for recalibration.",
      };
    }

    if (supabase && blueprint.recommended_protocol?.length) {
      const therapyNames = blueprint.recommended_protocol.map((p) => p.therapy);
      const { data: pricing } = await supabase
        .from("service_pricing")
        .select("service_name, min_price_cents, max_price_cents, avg_sessions")
        .in("service_name", therapyNames);
      if (pricing?.length) {
        let minT = 0, maxT = 0;
        for (const r of pricing as Array<{ min_price_cents: number; max_price_cents: number; avg_sessions: number }>) {
          minT += r.min_price_cents * (r.avg_sessions || 1);
          maxT += r.max_price_cents * (r.avg_sessions || 1);
        }
        blueprint.estimated_investment_range = `$${(minT / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })} – $${(maxT / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
      }
    }

    const recommended_protocol = (blueprint.recommended_protocol || []) as ProtocolItem[];
    const recommended_labs = blueprint.recommended_labs || [];

    if (supabase) {
      const { data: row, error } = await supabase
        .from("hormone_sessions")
        .insert({
          age_range: intake.age_range || null,
          biological_sex: intake.biological_sex || null,
          menopause_status: intake.menopause_status || null,
          top_symptoms: intake.top_symptoms,
          sleep_quality: intake.sleep_quality || null,
          energy_level: intake.energy_level || null,
          weight_change: intake.weight_change || null,
          stress_level: intake.stress_level || null,
          prior_hormone_therapy: intake.prior_hormone_therapy,
          uploaded_labs_url: parsed.data.uploaded_labs_url ?? null,
          ai_summary: blueprint,
          recommended_labs: recommended_labs,
          recommended_protocol: recommended_protocol,
          estimated_timeline: blueprint.timeline_expectation || null,
          estimated_investment_range: blueprint.estimated_investment_range || null,
          severity_score: blueprint.severity_score ?? null,
          conversion_status: "generated",
        })
        .select("id, created_at")
        .single();

      if (error) console.error("hormone_sessions insert error", error);

      return NextResponse.json({
        session_id: row?.id ?? null,
        blueprint,
      });
    }

    return NextResponse.json({ session_id: null, blueprint });
  } catch (e) {
    console.error("hormone/blueprint error", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
