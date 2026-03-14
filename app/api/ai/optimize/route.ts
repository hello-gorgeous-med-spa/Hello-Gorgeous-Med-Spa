import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export interface SocialOptimization {
  instagram: {
    caption: string;
    hashtags: string[];
    altText: string;
  };
  tiktok: {
    caption: string;
    hashtags: string[];
    sounds: string[];
  };
  facebook: {
    caption: string;
    hashtags: string[];
  };
  youtube: {
    title: string;
    description: string;
    tags: string[];
  };
  seo: {
    keywords: string[];
    metaDescription: string;
  };
}

interface OptimizeRequest {
  service: string;
  headline: string;
  benefits?: string[];
  location?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OptimizeRequest = await request.json();
    const { service, headline, benefits = [], location = "Oswego, IL" } = body;

    if (!service || !headline) {
      return NextResponse.json({ error: "Service and headline required" }, { status: 400 });
    }

    const systemPrompt = `You are a social media optimization expert for "Hello Gorgeous Med Spa" in ${location}.

Generate platform-optimized content for a med spa marketing campaign.

Return ONLY valid JSON with this exact structure:
{
  "instagram": {
    "caption": "Instagram caption with emojis and line breaks (max 2200 chars)",
    "hashtags": ["30 relevant hashtags without #"],
    "altText": "Alt text for accessibility"
  },
  "tiktok": {
    "caption": "Short, trendy TikTok caption (max 150 chars)",
    "hashtags": ["15 trending TikTok hashtags"],
    "sounds": ["3 trending sound suggestions"]
  },
  "facebook": {
    "caption": "Longer Facebook caption with emojis",
    "hashtags": ["10 Facebook hashtags"]
  },
  "youtube": {
    "title": "SEO optimized title (max 70 chars)",
    "description": "Full YouTube description with links and timestamps",
    "tags": ["20 YouTube tags"]
  },
  "seo": {
    "keywords": ["10 high-volume keywords for this service"],
    "metaDescription": "155 char meta description"
  }
}

Include local SEO keywords like "${location}", "near me", etc.
Make content engaging, shareable, and optimized for each platform's algorithm.`;

    const userPrompt = `Optimize content for:
Service: ${service}
Headline: ${headline}
Benefits: ${benefits.join(", ")}
Location: ${location}

Make it viral-worthy and algorithm-friendly for all platforms.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content || "";

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const optimization: SocialOptimization = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, optimization });
      }
      return NextResponse.json({ error: "Failed to parse optimization" }, { status: 500 });
    } catch {
      console.error("JSON parse error:", content);
      return NextResponse.json({ error: "Failed to parse optimization" }, { status: 500 });
    }
  } catch (error) {
    console.error("Optimization error:", error);
    return NextResponse.json({ error: "Failed to optimize content" }, { status: 500 });
  }
}
