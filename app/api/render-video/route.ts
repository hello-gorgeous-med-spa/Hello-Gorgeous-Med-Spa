import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

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
    brandColor: string;
    beforeImage?: string;
    afterImage?: string;
  };
}

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

export async function POST(request: Request) {
  try {
    const body: RenderRequest = await request.json();
    const { template, format, props } = body;

    const composition = COMPOSITION_MAP[template]?.[format] || "ServicePromoVertical";
    
    const timestamp = Date.now();
    const sanitizedName = props.serviceName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const outputFilename = `${sanitizedName}-${format}-${timestamp}.mp4`;
    const outputPath = path.join(process.cwd(), "public", "videos", outputFilename);

    const videosDir = path.join(process.cwd(), "public", "videos");
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    const remotionDir = path.join(process.cwd(), "remotion-videos");
    
    const inputProps = JSON.stringify({
      ...props,
      format,
    });

    const command = `cd "${remotionDir}" && npx remotion render src/index.tsx ${composition} "${outputPath}" --props='${inputProps.replace(/'/g, "\\'")}'`;

    console.log("[Render Video] Starting render...");
    console.log("[Render Video] Composition:", composition);
    console.log("[Render Video] Output:", outputPath);

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 300000,
        maxBuffer: 50 * 1024 * 1024,
      });

      console.log("[Render Video] Render complete");
      if (stderr) console.log("[Render Video] stderr:", stderr);

      const videoUrl = `/videos/${outputFilename}`;

      return NextResponse.json({
        success: true,
        videoUrl,
        filename: outputFilename,
        composition,
        format,
      });
    } catch (renderError: any) {
      console.error("[Render Video] Render failed:", renderError.message);
      
      return NextResponse.json(
        {
          success: false,
          error: "Video rendering failed",
          details: renderError.message,
          hint: "Make sure Remotion is properly set up in /remotion-videos",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[Render Video] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const videosDir = path.join(process.cwd(), "public", "videos");
    
    if (!fs.existsSync(videosDir)) {
      return NextResponse.json({ videos: [] });
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

    return NextResponse.json({ videos });
  } catch (error: any) {
    console.error("[Render Video] Error listing videos:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
