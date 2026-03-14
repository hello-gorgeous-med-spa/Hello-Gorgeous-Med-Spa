import { NextResponse } from "next/server";

interface ScriptRequest {
  serviceName: string;
  headline: string;
  price: string;
  benefits: string[];
  promoLabel: string;
}

interface VideoScene {
  id: string;
  name: string;
  duration: string;
  textOnScreen: string;
  voiceoverScript: string;
}

function generateServiceScript(data: ScriptRequest): VideoScene[] {
  const { serviceName, headline, price, benefits, promoLabel } = data;

  const benefitsList = benefits.slice(0, 4).join(". ");

  return [
    {
      id: "intro",
      name: "Intro",
      duration: "0-3s",
      textOnScreen: "HELLO GORGEOUS MED SPA",
      voiceoverScript: `Discover ${serviceName} at Hello Gorgeous Med Spa.`,
    },
    {
      id: "problem",
      name: "The Problem",
      duration: "3-7s",
      textOnScreen: `Ready for a change?`,
      voiceoverScript: `Are you ready to transform your look and feel your best?`,
    },
    {
      id: "solution",
      name: "The Solution",
      duration: "7-12s",
      textOnScreen: serviceName.toUpperCase(),
      voiceoverScript: `${serviceName} delivers results you'll love.`,
    },
    {
      id: "benefits",
      name: "Benefits",
      duration: "12-17s",
      textOnScreen: benefits.slice(0, 2).join(" • "),
      voiceoverScript: benefitsList,
    },
    {
      id: "results",
      name: "Before/After",
      duration: "17-22s",
      textOnScreen: "REAL RESULTS",
      voiceoverScript: "See real results from real clients.",
    },
    {
      id: "offer",
      name: "Special Offer",
      duration: "22-26s",
      textOnScreen: `${promoLabel.toUpperCase()} ${price}`,
      voiceoverScript: `${promoLabel} at just ${price.replace("$", "").replace(",", "")}.`,
    },
    {
      id: "cta",
      name: "Call to Action",
      duration: "26-30s",
      textOnScreen: "BOOK NOW | 630-636-6193",
      voiceoverScript: "Hello Gorgeous Med Spa, Oswego Illinois. Call to book today.",
    },
  ];
}

export async function POST(request: Request) {
  try {
    const body: ScriptRequest = await request.json();

    const openaiKey = process.env.OPEN_API_KEY || process.env.OPENAI_API_KEY;

    if (openaiKey && openaiKey.startsWith("sk-")) {
      try {
        const prompt = `Generate a 30-second promotional video script for a med spa service.

Service: ${body.serviceName}
Headline: ${body.headline}
Price: ${body.price}
Benefits: ${body.benefits.join(", ")}
Promo: ${body.promoLabel}

Create 7 scenes with this exact JSON structure. Keep voiceover scripts conversational and under 10 words each for natural pacing:

[
  {"id": "intro", "name": "Intro", "duration": "0-3s", "textOnScreen": "...", "voiceoverScript": "..."},
  {"id": "problem", "name": "The Problem", "duration": "3-7s", "textOnScreen": "...", "voiceoverScript": "..."},
  {"id": "solution", "name": "The Solution", "duration": "7-12s", "textOnScreen": "...", "voiceoverScript": "..."},
  {"id": "benefits", "name": "Benefits", "duration": "12-17s", "textOnScreen": "...", "voiceoverScript": "..."},
  {"id": "results", "name": "Before/After", "duration": "17-22s", "textOnScreen": "...", "voiceoverScript": "..."},
  {"id": "offer", "name": "Special Offer", "duration": "22-26s", "textOnScreen": "...", "voiceoverScript": "..."},
  {"id": "cta", "name": "Call to Action", "duration": "26-30s", "textOnScreen": "BOOK NOW | 630-636-6193", "voiceoverScript": "Hello Gorgeous Med Spa, Oswego Illinois. Book now."}
]

Return ONLY the JSON array, no explanation.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a marketing copywriter specializing in med spa promotional videos. Output only valid JSON.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const content = result.choices?.[0]?.message?.content;
          
          if (content) {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              const scenes = JSON.parse(jsonMatch[0]);
              return NextResponse.json({ success: true, scenes, source: "ai" });
            }
          }
        }
      } catch (aiError) {
        console.error("[Script Gen] AI error, falling back to template:", aiError);
      }
    }

    const scenes = generateServiceScript(body);
    return NextResponse.json({ success: true, scenes, source: "template" });

  } catch (error: any) {
    console.error("[Script Gen] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/generate-script",
    description: "Generate video script based on service details",
    body: {
      serviceName: "Service name",
      headline: "Main headline",
      price: "Price string",
      benefits: ["Array", "of", "benefits"],
      promoLabel: "Promo label text",
    },
    response: {
      scenes: [
        {
          id: "scene-id",
          name: "Scene Name",
          duration: "0-3s",
          textOnScreen: "Text displayed",
          voiceoverScript: "What AI says",
        },
      ],
    },
  });
}
