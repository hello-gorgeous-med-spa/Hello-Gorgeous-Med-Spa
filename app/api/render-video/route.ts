import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const CREATOMATE_API_KEY = process.env.CREATOMATE_API_KEY;
const CREATOMATE_API = "https://api.creatomate.com/v1";

const TEMPLATE_IDS: Record<string, string> = {
  vertical: process.env.CREATOMATE_TEMPLATE_VERTICAL || "",
  square: process.env.CREATOMATE_TEMPLATE_SQUARE || "",
  horizontal: process.env.CREATOMATE_TEMPLATE_HORIZONTAL || "",
};

interface RenderRequest {
  template: string;
  format: "vertical" | "square" | "horizontal";
  props: {
    serviceName: string;
    headline: string;
    subheadline?: string;
    price: string;
    originalPrice?: string;
    promoLabel?: string;
    benefits: string[];
    clinicName: string;
    phone: string;
    website: string;
    brandColor?: string;
    qualityPreset?: string;
    videoStyle?: string;
    beforeImage?: string;
    afterImage?: string;
  };
}

function buildModifications(props: RenderRequest["props"]): Record<string, string> {
  const mods: Record<string, string> = {
    Headline: props.headline || "",
    Price: props.price || "",
    ServiceName: props.serviceName || "",
    Phone: props.phone || "630-636-6193",
    Website: props.website || "hellogorgeousmedspa.com",
  };

  if (props.originalPrice) mods.OriginalPrice = props.originalPrice;
  if (props.promoLabel) mods.PromoLabel = props.promoLabel;

  props.benefits.forEach((benefit, i) => {
    if (i < 4) mods[`Benefit${i + 1}`] = benefit;
  });

  if (props.beforeImage) mods.BeforeImage = props.beforeImage;
  if (props.afterImage) mods.AfterImage = props.afterImage;

  return mods;
}

export async function POST(request: Request) {
  try {
    if (!CREATOMATE_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Video rendering not configured. Set CREATOMATE_API_KEY in environment variables.",
        },
        { status: 503 }
      );
    }

    const body: RenderRequest = await request.json();
    const { format, props } = body;

    const templateId = TEMPLATE_IDS[format];
    if (!templateId) {
      return NextResponse.json(
        {
          success: false,
          error: `No template configured for format "${format}". Set CREATOMATE_TEMPLATE_${format.toUpperCase()} in environment variables.`,
        },
        { status: 400 }
      );
    }

    const modifications = buildModifications(props);

    // Start render via Creatomate REST API (non-blocking)
    const renderResponse = await fetch(`${CREATOMATE_API}/renders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CREATOMATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          template_id: templateId,
          modifications,
        },
      ]),
    });

    if (!renderResponse.ok) {
      const errorBody = await renderResponse.text();
      console.error("[Render Video] Creatomate error:", renderResponse.status, errorBody);
      return NextResponse.json(
        { success: false, error: `Creatomate API error: ${renderResponse.status}` },
        { status: 502 }
      );
    }

    const renders = await renderResponse.json();
    const render = renders[0];

    if (!render?.id) {
      return NextResponse.json(
        { success: false, error: "No render ID returned from Creatomate" },
        { status: 502 }
      );
    }

    // Store job in Supabase for persistent tracking
    const supabase = await createServerSupabaseClient();
    let jobId = render.id;

    if (supabase) {
      const { data: job } = await supabase
        .from("render_jobs")
        .insert({
          creatomate_render_id: render.id,
          service: body.template,
          format,
          status: render.status === "succeeded" ? "completed" : "rendering",
          video_url: render.url || null,
          props: props as unknown as Record<string, unknown>,
        })
        .select("id")
        .single();

      if (job) jobId = job.id;
    }

    // If already completed (fast renders), return immediately
    if (render.status === "succeeded" && render.url) {
      return NextResponse.json({
        success: true,
        jobId,
        status: "completed",
        videoUrl: render.url,
      });
    }

    return NextResponse.json({
      success: true,
      jobId,
      creatomateId: render.id,
      status: "rendering",
      message: "Video rendering in cloud. Poll GET /api/render-video?jobId=" + jobId,
      estimatedTime: "30-60 seconds",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Render Video] Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ error: "jobId parameter required" }, { status: 400 });
    }

    // First check Supabase for the job
    const supabase = await createServerSupabaseClient();

    if (supabase) {
      const { data: job } = await supabase
        .from("render_jobs")
        .select("*")
        .or(`id.eq.${jobId},creatomate_render_id.eq.${jobId}`)
        .single();

      if (job) {
        // If already completed, return cached result
        if (job.status === "completed" && job.video_url) {
          return NextResponse.json({
            job: {
              id: job.id,
              status: "completed",
              videoUrl: job.video_url,
            },
          });
        }

        // Poll Creatomate for current status
        if (job.creatomate_render_id && CREATOMATE_API_KEY) {
          const statusResponse = await fetch(
            `${CREATOMATE_API}/renders/${job.creatomate_render_id}`,
            {
              headers: { Authorization: `Bearer ${CREATOMATE_API_KEY}` },
            }
          );

          if (statusResponse.ok) {
            const render = await statusResponse.json();

            if (render.status === "succeeded" && render.url) {
              await supabase
                .from("render_jobs")
                .update({
                  status: "completed",
                  video_url: render.url,
                  completed_at: new Date().toISOString(),
                })
                .eq("id", job.id);

              return NextResponse.json({
                job: {
                  id: job.id,
                  status: "completed",
                  videoUrl: render.url,
                },
              });
            }

            if (render.status === "failed") {
              await supabase
                .from("render_jobs")
                .update({
                  status: "failed",
                  error: render.error_message || "Render failed",
                  completed_at: new Date().toISOString(),
                })
                .eq("id", job.id);

              return NextResponse.json({
                job: {
                  id: job.id,
                  status: "failed",
                  error: render.error_message || "Render failed",
                },
              });
            }

            return NextResponse.json({
              job: {
                id: job.id,
                status: "rendering",
                progress: render.progress || 0,
              },
            });
          }
        }

        return NextResponse.json({
          job: {
            id: job.id,
            status: job.status,
            videoUrl: job.video_url,
          },
        });
      }
    }

    // Fallback: try Creatomate directly with the ID
    if (CREATOMATE_API_KEY) {
      const statusResponse = await fetch(`${CREATOMATE_API}/renders/${jobId}`, {
        headers: { Authorization: `Bearer ${CREATOMATE_API_KEY}` },
      });

      if (statusResponse.ok) {
        const render = await statusResponse.json();
        return NextResponse.json({
          job: {
            id: render.id,
            status: render.status === "succeeded" ? "completed" : render.status === "failed" ? "failed" : "rendering",
            videoUrl: render.url || null,
            progress: render.progress || 0,
          },
        });
      }
    }

    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Render Video] Status check error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
