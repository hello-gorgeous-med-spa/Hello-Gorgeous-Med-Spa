/**
 * POST /api/journey/roadmap
 * Accepts journey intake, calls AI for structured roadmap, stores in Supabase, returns roadmap.
 * Rate limited: 5 requests per IP per hour (Supabase-backed).
 * Cost range can be overridden by service_pricing table (Phase 6).
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import type {
  JourneyIntake,
  RoadmapAIOutput,
  RecommendedServiceItem,
  ServicePricingRow,
} from "@/lib/journey-types";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_429_MESSAGE = "Too many roadmap requests. Please try again later.";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const raw = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return raw || "unknown";
}

function getHourTs(): string {
  return new Date().toISOString().slice(0, 13);
}

const SYSTEM_PROMPT = `You are a medical aesthetic treatment planning assistant for Hello Gorgeous Med Spa.
Generate a personalized treatment roadmap based on user inputs.
Prioritize realistic, ethical recommendations. Do not diagnose or prescribe.
Output valid JSON only, no markdown or extra text.`;

const USER_PROMPT_TEMPLATE = (intake: JourneyIntake) =>
  `Based on this intake, output a single JSON object with exactly these keys: roadmap_title, recommended_services (array of { service, reason, priority_order }), estimated_sessions, timeline_estimate, estimated_cost_range (e.g. "$1200 - $2500"), maintenance_plan, confidence_message.
Intake:
${JSON.stringify(intake)}`;

function parseAIJson(body: string): RoadmapAIOutput | null {
  const trimmed = body.trim();
  const jsonStr =
    trimmed.startsWith("```") && trimmed.endsWith("```")
      ? trimmed.replace(/^```\w*\n?|\n?```$/g, "").trim()
      : trimmed;
  try {
    return JSON.parse(jsonStr) as RoadmapAIOutput;
  } catch {
    return null;
  }
}

async function fetchPricing(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  serviceNames: string[]
): Promise<ServicePricingRow[]> {
  if (serviceNames.length === 0) return [];
  const { data } = await supabase
    .from("service_pricing")
    .select("service_name, min_price_cents, max_price_cents, avg_sessions")
    .in("service_name", serviceNames);
  return (data || []) as ServicePricingRow[];
}

function computeCostRangeFromPricing(rows: ServicePricingRow[]): string {
  if (rows.length === 0) return "";
  let minTotal = 0;
  let maxTotal = 0;
  for (const r of rows) {
    minTotal += r.min_price_cents * r.avg_sessions;
    maxTotal += r.max_price_cents * r.avg_sessions;
  }
  const minDollars = (minTotal / 100).toLocaleString("en-US", { minimumFractionDigits: 0 });
  const maxDollars = (maxTotal / 100).toLocaleString("en-US", { minimumFractionDigits: 0 });
  return `$${minDollars} – $${maxDollars}`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();

    // Rate limit: 5 per IP per hour (persisted in Supabase)
    if (supabase) {
      const ip = getClientIp(request);
      const hourTs = getHourTs();
      const { data: count, error: rpcError } = await supabase.rpc("journey_rate_limit_inc", {
        p_ip: ip,
        p_hour_ts: hourTs,
      });
      if (rpcError) {
        console.error("journey rate limit rpc error", rpcError);
        // Allow request if rate limit check fails (fail open for availability)
      } else if (typeof count === "number" && count > RATE_LIMIT_MAX) {
        console.warn("[rate-limit] Roadmap limit exceeded", { ip: ip.slice(0, 8) + "…", hourTs, count });
        return NextResponse.json(
          { error: RATE_LIMIT_429_MESSAGE },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const intake: JourneyIntake = {
      primary_concern: String(body.primary_concern ?? "").trim(),
      desired_change_level: body.desired_change_level ?? "balanced",
      experience_level: body.experience_level ?? "first_time",
      timeline_preference: body.timeline_preference ?? "flexible",
      downtime_preference: body.downtime_preference ?? "minimal",
      decision_style: body.decision_style ?? "cautious",
    };

    const apiKey = process.env.OPENAI_API_KEY;
    let roadmap: RoadmapAIOutput;

    if (apiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
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
        console.error("OpenAI error", res.status, errText);
        return NextResponse.json(
          { error: "AI service unavailable" },
          { status: 502 }
        );
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        return NextResponse.json(
          { error: "Invalid AI response" },
          { status: 502 }
        );
      }

      const parsed = parseAIJson(content);
      if (!parsed || !Array.isArray(parsed.recommended_services)) {
        return NextResponse.json(
          { error: "Invalid AI response format" },
          { status: 502 }
        );
      }
      roadmap = parsed;
    } else {
      // Fallback when OPENAI_API_KEY not set (dev)
      roadmap = {
        roadmap_title: "Your Confidence Blueprint",
        recommended_services: [
          { service: "Consultation", reason: "Start with a personalized consultation to align goals.", priority_order: 1 },
          { service: "Botox or Dysport", reason: "Common first step for lines and prevention.", priority_order: 2 },
        ],
        estimated_sessions: "2–3 sessions",
        timeline_estimate: "6–12 weeks",
        estimated_cost_range: "$400 – $1,200",
        maintenance_plan: "Every 4–6 months for neuromodulators",
        confidence_message: "Your plan is educational and should be reviewed with a licensed provider at Hello Gorgeous.",
      };
    }

    // Override cost range from service_pricing if available
    if (supabase && roadmap.recommended_services?.length) {
      const names = roadmap.recommended_services.map((s) => s.service);
      const pricing = await fetchPricing(supabase, names);
      const computed = computeCostRangeFromPricing(pricing);
      if (computed) roadmap.estimated_cost_range = computed;
    }

    const recommended_services = roadmap.recommended_services as RecommendedServiceItem[];
    const recommended_timeline = roadmap.timeline_estimate || roadmap.estimated_sessions || "";

    if (supabase) {
      const { data: row, error } = await supabase
        .from("journey_sessions")
        .insert({
          primary_concern: intake.primary_concern || null,
          desired_change_level: intake.desired_change_level,
          experience_level: intake.experience_level,
          timeline_preference: intake.timeline_preference,
          downtime_preference: intake.downtime_preference,
          decision_style: intake.decision_style,
          uploaded_image_url: body.uploaded_image_url ?? null,
          ai_summary: roadmap,
          recommended_services: recommended_services,
          estimated_cost_range: roadmap.estimated_cost_range,
          recommended_timeline,
          conversion_status: "generated",
        })
        .select("id, created_at")
        .single();

      if (error) {
        console.error("journey_sessions insert error", error);
        // Still return roadmap; storage is best-effort
      }

      return NextResponse.json({
        session_id: row?.id ?? null,
        roadmap,
      });
    }

    return NextResponse.json({ session_id: null, roadmap });
  } catch (e) {
    console.error("journey/roadmap error", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
