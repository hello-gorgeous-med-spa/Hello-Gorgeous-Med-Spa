import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

interface ContentPiece {
  id: string;
  week: number;
  day: number;
  type: "reel" | "image" | "educational";
  service: string;
  hook: string;
  headline: string;
  caption: string;
  hashtags: string[];
  benefits: string[];
  cta: string;
  scheduledDate?: string;
}

interface ContentCalendar {
  pieces: ContentPiece[];
  services: string[];
  totalReels: number;
  totalImages: number;
  totalEducational: number;
}

interface BatchRequest {
  days?: number;
  services?: string[];
  startDate?: string;
}

const DEFAULT_SERVICES = [
  "Weight Loss (Tirzepatide/Semaglutide)",
  "Botox & Jeuveau",
  "Dermal Fillers",
  "Laser Treatments (Solaria CO2)",
  "Morpheus8 RF",
  "IV Therapy",
  "PRF Hair Restoration",
  "Microneedling",
];

export async function POST(request: NextRequest) {
  try {
    const body: BatchRequest = await request.json();
    const { 
      days = 30, 
      services = DEFAULT_SERVICES.slice(0, 4),
      startDate = new Date().toISOString().split("T")[0],
    } = body;

    // Calculate content distribution
    const reels = Math.floor(days / 3); // ~10 for 30 days
    const images = Math.floor(days / 3);
    const educational = days - reels - images;

    const systemPrompt = `You are a social media content strategist for "Hello Gorgeous Med Spa" in Oswego, IL.
Never disparage or compare unfavorably to competitors. Focus only on Hello Gorgeous's strengths.

Create a ${days}-day content calendar with:
- ${reels} Reels/Videos (engaging, hook-driven)
- ${images} Image Posts (before/after, results, offers)
- ${educational} Educational Posts (tips, myths, FAQs)

Services to cover: ${services.join(", ")}

Each piece needs:
- Attention-grabbing hook (under 10 words)
- Headline for the post
- Platform-ready caption
- 5 relevant hashtags
- 3-4 benefits to highlight
- Clear CTA

Rotate services across weeks:
Week 1: Focus on ${services[0] || "Weight Loss"}
Week 2: Focus on ${services[1] || "Botox"}
Week 3: Focus on ${services[2] || "Laser"}
Week 4: Focus on ${services[3] || "Wellness"}

Return ONLY valid JSON:
{
  "pieces": [
    {
      "id": "content-1",
      "week": 1,
      "day": 1,
      "type": "reel",
      "service": "Weight Loss",
      "hook": "Struggling to lose weight?",
      "headline": "Transform Your Body",
      "caption": "Full caption here...",
      "hashtags": ["weightloss", "tirzepatide", "medspa", "transformation", "glp1"],
      "benefits": ["Lose 15-25 lbs", "FDA approved", "Physician supervised"],
      "cta": "Book your consultation today!"
    }
  ],
  "services": ["Weight Loss", "Botox", "Laser", "Wellness"],
  "totalReels": ${reels},
  "totalImages": ${images},
  "totalEducational": ${educational}
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${days} days of content starting ${startDate}. Make every piece unique and engaging.` },
      ],
      temperature: 0.9,
      max_tokens: 8000,
    });

    const content = completion.choices[0]?.message?.content || "";

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const calendar: ContentCalendar = JSON.parse(jsonMatch[0]);
        
        // Add scheduled dates
        const start = new Date(startDate);
        calendar.pieces = calendar.pieces.map((piece, index) => ({
          ...piece,
          scheduledDate: new Date(
            start.getTime() + index * 24 * 60 * 60 * 1000
          ).toISOString().split("T")[0],
        }));

        return NextResponse.json({
          success: true,
          calendar,
          summary: {
            totalContent: calendar.pieces.length,
            reels: calendar.totalReels,
            images: calendar.totalImages,
            educational: calendar.totalEducational,
            dateRange: {
              start: startDate,
              end: calendar.pieces[calendar.pieces.length - 1]?.scheduledDate,
            },
          },
        });
      }
      return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json({ error: "Failed to parse content" }, { status: 500 });
    }
  } catch (error) {
    console.error("Batch content error:", error);
    return NextResponse.json({ error: "Failed to generate batch content" }, { status: 500 });
  }
}
