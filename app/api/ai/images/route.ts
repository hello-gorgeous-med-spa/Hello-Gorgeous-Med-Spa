import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

interface ImageRequest {
  service: string;
  headline: string;
  offer?: string;
  audience?: string;
  style?: string;
  format?: "vertical" | "square" | "horizontal";
  count?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageRequest = await request.json();
    const { 
      service, 
      headline, 
      offer, 
      audience, 
      style = "luxury",
      format = "vertical",
      count = 2 
    } = body;

    if (!service || !headline) {
      return NextResponse.json(
        { error: "Service and headline are required" }, 
        { status: 400 }
      );
    }

    // Build the image prompt
    const styleDescriptions: Record<string, string> = {
      luxury: "luxurious, elegant, high-end aesthetic, soft pink and black color palette, gold accents",
      clean: "clean, clinical, professional medical spa, white and pink, minimalist",
      energetic: "vibrant, dynamic, energetic, bold colors, eye-catching",
      minimal: "minimal, sophisticated, understated elegance, muted tones",
    };

    const formatSizes: Record<string, string> = {
      vertical: "1024x1792",
      square: "1024x1024",
      horizontal: "1792x1024",
    };

    const prompt = `Professional medical spa advertisement for ${service}.
Headline: "${headline}"
${offer ? `Promotional offer: ${offer}` : ""}
${audience ? `Target audience: ${audience}` : ""}

Style: ${styleDescriptions[style] || styleDescriptions.luxury}
Brand: Hello Gorgeous Med Spa - luxury med spa aesthetic
Environment: Modern, clean medical spa setting

Design requirements:
- NO text or words in the image
- Beautiful, aspirational imagery
- Professional quality suitable for social media advertising
- Focus on results, transformation, and luxury experience
- Pink and black brand colors subtly incorporated
- Elegant, feminine aesthetic
- High-end beauty and wellness vibe`;

    // Generate images
    const generatedImages: string[] = [];
    const timestamp = Date.now();

    // Ensure directory exists
    const outputDir = path.join(process.cwd(), "public", "campaign-images");
    await mkdir(outputDir, { recursive: true });

    // Generate requested number of images (max 4)
    const imagesToGenerate = Math.min(count, 4);
    
    for (let i = 0; i < imagesToGenerate; i++) {
      try {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: formatSizes[format] as "1024x1024" | "1024x1792" | "1792x1024",
          quality: "standard",
          style: "vivid",
        });

        const imageUrl = response.data[0]?.url;
        if (imageUrl) {
          // Download and save locally
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = await imageResponse.arrayBuffer();
          const filename = `${service.toLowerCase().replace(/\s+/g, "-")}-${timestamp}-${i + 1}.png`;
          const filepath = path.join(outputDir, filename);
          
          await writeFile(filepath, Buffer.from(imageBuffer));
          generatedImages.push(`/campaign-images/${filename}`);
        }
      } catch (imgError) {
        console.error(`Failed to generate image ${i + 1}:`, imgError);
      }
    }

    if (generatedImages.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate any images" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: generatedImages,
      prompt: prompt.substring(0, 200) + "...",
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate images" }, 
      { status: 500 }
    );
  }
}
