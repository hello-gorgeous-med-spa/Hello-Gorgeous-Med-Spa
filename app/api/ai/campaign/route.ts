import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

interface CampaignRequest {
  prompt: string;
  service?: string;
  type: "full" | "hooks" | "captions" | "benefits";
}

export async function POST(request: NextRequest) {
  try {
    const body: CampaignRequest = await request.json();
    const { prompt, service, type } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "hooks":
        systemPrompt = `You are a viral social media marketing expert for a luxury med spa called "Hello Gorgeous Med Spa" in Oswego, IL.
Generate 6 attention-grabbing hooks (first 3 seconds of a video) that would stop someone from scrolling.
Each hook should be under 10 words, punchy, and create curiosity or emotion.
Return ONLY a JSON array of strings, no other text.`;
        userPrompt = `Generate 6 viral hooks for: ${prompt}${service ? ` (Service: ${service})` : ""}`;
        break;

      case "captions":
        systemPrompt = `You are a social media copywriter for "Hello Gorgeous Med Spa" - a luxury med spa in Oswego, IL.
Generate platform-specific captions that drive bookings.
Return ONLY valid JSON with this exact structure:
{
  "instagram": "caption with emojis and line breaks",
  "tiktok": "shorter, trendy caption",
  "facebook": "longer, more detailed caption",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
}`;
        userPrompt = `Generate social captions for: ${prompt}${service ? ` (Service: ${service})` : ""}`;
        break;

      case "benefits":
        systemPrompt = `You are a medical spa marketing expert for "Hello Gorgeous Med Spa".
Generate 4-5 compelling benefits that highlight the value of the treatment.
Each benefit should be concise (under 8 words) and focus on transformation/results.
Return ONLY a JSON array of strings.`;
        userPrompt = `Generate treatment benefits for: ${prompt}${service ? ` (Service: ${service})` : ""}`;
        break;

      case "full":
      default:
        systemPrompt = `You are a complete campaign generator for "Hello Gorgeous Med Spa" - a luxury med spa in Oswego, IL.
Generate a complete marketing campaign based on the user's prompt.
Return ONLY valid JSON with this exact structure:
{
  "headline": "Main headline (5-7 words)",
  "subheadline": "Supporting tagline",
  "hooks": ["hook1", "hook2", "hook3", "hook4"],
  "benefits": ["benefit1", "benefit2", "benefit3", "benefit4"],
  "cta": "Call to action text",
  "instagramCaption": "Instagram caption with emojis",
  "tiktokCaption": "TikTok caption (shorter, trendy)",
  "facebookCaption": "Facebook caption (longer)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "targetAudience": "Who this campaign targets",
  "tone": "Campaign tone (luxury/energetic/educational/emotional)"
}`;
        userPrompt = `Generate a complete campaign for: ${prompt}${service ? ` (Service: ${service})` : ""}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || "";
    
    // Parse JSON from response
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, data, type });
      }
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    } catch {
      console.error("JSON parse error:", content);
      return NextResponse.json({ error: "Failed to parse AI response", raw: content }, { status: 500 });
    }
  } catch (error) {
    console.error("Campaign API error:", error);
    return NextResponse.json({ error: "Failed to generate campaign" }, { status: 500 });
  }
}
