import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export interface ScoredHook {
  hook: string;
  score: number;
  type: "question" | "statistic" | "curiosity" | "emotion" | "controversy" | "transformation";
  reasoning: string;
}

interface HookRequest {
  prompt: string;
  service?: string;
  count?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: HookRequest = await request.json();
    const { prompt, service, count = 10 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = `You are a viral content strategist specializing in medical spa marketing. 
Your job is to create hooks that stop people from scrolling in the first 3 seconds.

Generate ${count} hooks for a social media video and score each one based on virality potential.

Hook types to use:
- question: Opens curiosity loop ("Struggling with...?")
- statistic: Shocking number ("Down 20 lbs in 90 days")
- curiosity: Creates intrigue ("The secret doctors don't tell you")
- emotion: Triggers feeling ("Finally feel confident again")
- controversy: Bold claim ("Creams don't work. Here's why.")
- transformation: Before/after promise ("From size 14 to size 6")

Score criteria (0-100):
- Scroll-stopping power (40%)
- Emotional impact (30%)
- Curiosity gap (20%)
- Relevance to med spa (10%)

Return ONLY valid JSON array with this structure:
[
  {
    "hook": "The hook text (under 10 words)",
    "score": 95,
    "type": "question",
    "reasoning": "Why this hook works"
  }
]

Sort by score descending (highest first).`;

    const userPrompt = `Generate ${count} viral hooks for: ${prompt}${service ? ` (Service: ${service})` : ""}

Make them punchy, emotional, and impossible to scroll past.
Mix different hook types for variety.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || "";

    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const hooks: ScoredHook[] = JSON.parse(jsonMatch[0]);
        // Sort by score and ensure top hook is returned
        const sortedHooks = hooks.sort((a, b) => b.score - a.score);
        
        return NextResponse.json({
          success: true,
          hooks: sortedHooks,
          bestHook: sortedHooks[0],
          averageScore: Math.round(
            sortedHooks.reduce((acc, h) => acc + h.score, 0) / sortedHooks.length
          ),
        });
      }
      return NextResponse.json({ error: "Failed to parse hooks" }, { status: 500 });
    } catch {
      console.error("JSON parse error:", content);
      return NextResponse.json({ error: "Failed to parse hooks" }, { status: 500 });
    }
  } catch (error) {
    console.error("Hook generation error:", error);
    return NextResponse.json({ error: "Failed to generate hooks" }, { status: 500 });
  }
}
