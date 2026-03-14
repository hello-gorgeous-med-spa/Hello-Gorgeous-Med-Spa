import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

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
    address: string;
    city: string;
    phone: string;
    website: string;
    // Brand Kit
    brandColor: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    logoUrl?: string;
    // Phase 1 settings
    qualityPreset?: "standard" | "high" | "ultra";
    videoStyle?: "clean" | "luxury" | "energetic" | "minimal";
    includeCaptions?: boolean;
    captionScript?: string;
    // Media
    beforeImage?: string;
    afterImage?: string;
    voiceoverUrl?: string;
  };
}

const QUALITY_CRF: Record<string, number> = {
  standard: 18,
  high: 16,
  ultra: 14,
};

interface RenderJob {
  id: string;
  status: "pending" | "rendering" | "completed" | "failed";
  composition: string;
  format: string;
  outputFilename: string;
  videoUrl?: string;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

const renderJobs: Map<string, RenderJob> = new Map();

const COMPOSITION_MAP: Record<string, Record<string, string>> = {
  solaria: {
    vertical: "SolariaPromoVertical",
    square: "SolariaPromoSquare",
    horizontal: "SolariaPromoHorizontal",
  },
  botox: {
    vertical: "BotoxPromoVertical",
    square: "ServicePromoSquare",
    horizontal: "ServicePromoHorizontal",
  },
  morpheus8: {
    vertical: "Morpheus8PromoVertical",
    square: "ServicePromoSquare",
    horizontal: "ServicePromoHorizontal",
  },
  weightloss: {
    vertical: "WeightLossPromoVertical",
    square: "ServicePromoSquare",
    horizontal: "ServicePromoHorizontal",
  },
  fillers: {
    vertical: "FillersPromoVertical",
    square: "ServicePromoSquare",
    horizontal: "ServicePromoHorizontal",
  },
  prf: {
    vertical: "PRFHairPromoVertical",
    square: "ServicePromoSquare",
    horizontal: "ServicePromoHorizontal",
  },
  iv: {
    vertical: "ServicePromoVertical",
    square: "ServicePromoSquare",
    horizontal: "ServicePromoHorizontal",
  },
  custom: {
    vertical: "ServicePromoVertical",
    square: "ServicePromoSquare",
    horizontal: "ServicePromoHorizontal",
  },
};

function startBackgroundRender(
  jobId: string,
  composition: string,
  outputPath: string,
  outputFilename: string,
  remotionDir: string,
  qualityPreset: string = "standard"
) {
  const job = renderJobs.get(jobId);
  if (!job) return;

  job.status = "rendering";
  renderJobs.set(jobId, job);

  const crf = QUALITY_CRF[qualityPreset] || 18;

  const renderProcess = spawn(
    "npx",
    ["remotion", "render", "src/index.tsx", composition, outputPath, `--crf=${crf}`],
    {
      cwd: remotionDir,
      shell: true,
      detached: true,
      stdio: "ignore",
    }
  );

  renderProcess.unref();
  
  console.log(`[Render Video] Using quality preset: ${qualityPreset} (CRF ${crf})`);

  const checkInterval = setInterval(() => {
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      if (stats.size > 1000000) {
        clearInterval(checkInterval);
        const updatedJob = renderJobs.get(jobId);
        if (updatedJob) {
          updatedJob.status = "completed";
          updatedJob.videoUrl = `/videos/${outputFilename}`;
          updatedJob.completedAt = new Date().toISOString();
          renderJobs.set(jobId, updatedJob);
        }
      }
    }
  }, 3000);

  setTimeout(() => {
    clearInterval(checkInterval);
    const updatedJob = renderJobs.get(jobId);
    if (updatedJob && updatedJob.status === "rendering") {
      if (fs.existsSync(outputPath)) {
        updatedJob.status = "completed";
        updatedJob.videoUrl = `/videos/${outputFilename}`;
      } else {
        updatedJob.status = "failed";
        updatedJob.error = "Render timed out";
      }
      updatedJob.completedAt = new Date().toISOString();
      renderJobs.set(jobId, updatedJob);
    }
  }, 180000);
}

export async function POST(request: Request) {
  try {
    const body: RenderRequest = await request.json();
    const { template, format, props } = body;

    const composition = COMPOSITION_MAP[template]?.[format] || "ServicePromoVertical";
    
    const timestamp = Date.now();
    const jobId = `job-${timestamp}`;
    const sanitizedName = props.serviceName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const outputFilename = `${sanitizedName}-${format}-${timestamp}.mp4`;
    const outputPath = path.join(process.cwd(), "public", "videos", outputFilename);

    const videosDir = path.join(process.cwd(), "public", "videos");
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    const remotionDir = path.join(process.cwd(), "remotion-videos");

    const job: RenderJob = {
      id: jobId,
      status: "pending",
      composition,
      format,
      outputFilename,
      startedAt: new Date().toISOString(),
    };
    renderJobs.set(jobId, job);

    console.log("[Render Video] Starting background render...");
    console.log("[Render Video] Job ID:", jobId);
    console.log("[Render Video] Composition:", composition);
    console.log("[Render Video] Quality:", props.qualityPreset || "standard");
    console.log("[Render Video] Style:", props.videoStyle || "clean");
    console.log("[Render Video] Captions:", props.includeCaptions ? "Yes" : "No");

    startBackgroundRender(
      jobId, 
      composition, 
      outputPath, 
      outputFilename, 
      remotionDir,
      props.qualityPreset || "standard"
    );

    return NextResponse.json({
      success: true,
      jobId,
      status: "rendering",
      message: "Video render started in background. Poll /api/render-video?jobId=" + jobId + " to check status.",
      estimatedTime: "60-90 seconds",
    });

  } catch (error: any) {
    console.error("[Render Video] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (jobId) {
      const job = renderJobs.get(jobId);
      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
      return NextResponse.json({ job });
    }

    const videosDir = path.join(process.cwd(), "public", "videos");
    
    if (!fs.existsSync(videosDir)) {
      return NextResponse.json({ videos: [], jobs: Array.from(renderJobs.values()) });
    }

    const files = fs.readdirSync(videosDir);
    const videos = files
      .filter((file) => file.endsWith(".mp4"))
      .map((file) => {
        const stats = fs.statSync(path.join(videosDir, file));
        return {
          filename: file,
          url: `/videos/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ 
      videos,
      jobs: Array.from(renderJobs.values()).slice(-10),
    });
  } catch (error: any) {
    console.error("[Render Video] Error listing videos:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
