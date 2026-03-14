import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

interface CampaignAnalysis {
  service: string;
  recommendedHooks: string[];
  recommendedHashtags: string[];
  recommendedCaptions: string[];
  bestPostingTimes: string[];
  bestVisualStyle: string;
  bestCaptionStyle: string;
  analysisNotes: string;
  confidenceScore: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, forceRefresh = false } = body;

    const supabase = await createClient();

    // Check for existing recent recommendations (unless force refresh)
    if (!forceRefresh) {
      const { data: existing } = await supabase
        .from("campaign_recommendations")
        .select("*")
        .eq("service", service || "all")
        .gte("expires_at", new Date().toISOString())
        .order("generated_at", { ascending: false })
        .limit(1)
        .single();

      if (existing) {
        return NextResponse.json({
          success: true,
          recommendations: existing,
          cached: true,
        });
      }
    }

    // Fetch campaign metrics with post data
    let metricsQuery = supabase
      .from("campaign_metrics")
      .select(`
        *,
        social_posts (
          hook,
          caption,
          visual_style,
          service,
          hashtags,
          posted_at
        )
      `)
      .order("engagement_rate", { ascending: false })
      .limit(100);

    if (service) {
      metricsQuery = metricsQuery.eq("social_posts.service", service);
    }

    const { data: metrics, error: metricsError } = await metricsQuery;

    if (metricsError) {
      // If no data, generate recommendations from templates
      if (metricsError.code === "42P01") {
        const defaultRecs = await generateDefaultRecommendations(service);
        return NextResponse.json({ success: true, recommendations: defaultRecs, fromDefaults: true });
      }
      throw metricsError;
    }

    // If no metrics yet, use AI to generate baseline recommendations
    if (!metrics || metrics.length === 0) {
      const defaultRecs = await generateDefaultRecommendations(service);
      return NextResponse.json({ success: true, recommendations: defaultRecs, fromDefaults: true });
    }

    // Prepare data for AI analysis
    const analysisData = metrics.map((m) => ({
      hook: m.social_posts?.hook,
      caption: m.social_posts?.caption?.substring(0, 200),
      visualStyle: m.social_posts?.visual_style,
      hashtags: m.social_posts?.hashtags,
      postedAt: m.social_posts?.posted_at,
      views: m.views,
      likes: m.likes,
      comments: m.comments,
      shares: m.shares,
      saves: m.saves,
      bookings: m.bookings,
      engagementRate: m.engagement_rate,
    }));

    // AI Analysis
    const analysis = await runAIAnalysis(analysisData, service);

    // Store recommendations
    const { data: saved, error: saveError } = await supabase
      .from("campaign_recommendations")
      .insert({
        service: service || "all",
        recommended_hooks: analysis.recommendedHooks,
        recommended_hashtags: analysis.recommendedHashtags,
        recommended_captions: analysis.recommendedCaptions,
        best_posting_times: analysis.bestPostingTimes,
        best_visual_style: analysis.bestVisualStyle,
        best_caption_style: analysis.bestCaptionStyle,
        campaigns_analyzed: metrics.length,
        total_views: metrics.reduce((sum, m) => sum + (m.views || 0), 0),
        total_engagement: metrics.reduce(
          (sum, m) => sum + (m.likes || 0) + (m.comments || 0) + (m.shares || 0),
          0
        ),
        avg_engagement_rate: metrics.reduce((sum, m) => sum + (m.engagement_rate || 0), 0) / metrics.length,
        analysis_notes: analysis.analysisNotes,
        confidence_score: analysis.confidenceScore,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving recommendations:", saveError);
    }

    return NextResponse.json({
      success: true,
      recommendations: saved || analysis,
      campaignsAnalyzed: metrics.length,
    });
  } catch (error) {
    console.error("Campaign analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze campaigns" }, { status: 500 });
  }
}

async function runAIAnalysis(
  data: Array<{
    hook?: string;
    caption?: string;
    visualStyle?: string;
    hashtags?: string[];
    postedAt?: string;
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    bookings?: number;
    engagementRate?: number;
  }>,
  service?: string
): Promise<CampaignAnalysis> {
  const systemPrompt = `You are a social media analytics expert for "Hello Gorgeous Med Spa".
Analyze campaign performance data and identify patterns that drive engagement and bookings.

Return ONLY valid JSON with this structure:
{
  "recommendedHooks": ["top 5 performing hook patterns"],
  "recommendedHashtags": ["top 10 hashtags by engagement"],
  "recommendedCaptions": ["3 caption style examples that work"],
  "bestPostingTimes": ["top 3 posting times"],
  "bestVisualStyle": "single best visual style",
  "bestCaptionStyle": "educational_story | promotional | before_after | testimonial",
  "analysisNotes": "Summary of key insights",
  "confidenceScore": 0.85
}

Focus on what actually drives bookings, not just likes.`;

  const userPrompt = `Analyze these ${data.length} campaign metrics for ${service || "all services"}:

${JSON.stringify(data.slice(0, 20), null, 2)}

Identify:
1. Which hooks got the most engagement?
2. What caption styles convert best?
3. Which posting times perform best?
4. What visual styles work?
5. What hashtags increase reach?

Give actionable recommendations.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = completion.choices[0]?.message?.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    console.error("Failed to parse AI response");
  }

  // Return defaults if parsing fails
  return {
    service: service || "all",
    recommendedHooks: [
      "Struggling with [problem]?",
      "[Number] results in [timeframe]",
      "The secret to [benefit]",
    ],
    recommendedHashtags: ["medspa", "skincare", "beautytips", "oswego", "transformation"],
    recommendedCaptions: ["Start with the problem, end with the solution"],
    bestPostingTimes: ["7:00 PM", "12:00 PM", "9:00 AM"],
    bestVisualStyle: "before_after",
    bestCaptionStyle: "educational_story",
    analysisNotes: "Insufficient data for detailed analysis. Using baseline recommendations.",
    confidenceScore: 0.5,
  };
}

async function generateDefaultRecommendations(service?: string): Promise<CampaignAnalysis> {
  const serviceDefaults: Record<string, Partial<CampaignAnalysis>> = {
    weightloss: {
      recommendedHooks: [
        "Struggling to lose weight?",
        "Down 20 lbs in 90 days",
        "The weight loss injection everyone's talking about",
        "Stubborn weight? This may help",
        "Finally, weight loss that actually works",
      ],
      recommendedHashtags: [
        "weightloss", "tirzepatide", "semaglutide", "glp1", "medicalweightloss",
        "weightlossjourney", "medspa", "healthylifestyle", "transformation", "oswego"
      ],
      bestVisualStyle: "transformation",
    },
    botox: {
      recommendedHooks: [
        "Turn back the clock",
        "Wrinkles? Not anymore",
        "Look 10 years younger",
        "The anti-aging secret",
        "15 minutes to smooth skin",
      ],
      recommendedHashtags: [
        "botox", "antiaging", "wrinklefree", "medspa", "beautytips",
        "skincare", "youthfulskin", "injectables", "beautyclinic", "oswego"
      ],
      bestVisualStyle: "before_after",
    },
    solaria: {
      recommendedHooks: [
        "Resurface your skin",
        "The gold standard in skin",
        "Transform your texture",
        "Laser your way to flawless",
        "This isn't a filter",
      ],
      recommendedHashtags: [
        "lasertreatment", "skinresurfacing", "co2laser", "antiaging", "medspa",
        "skintightening", "collagen", "glowingskin", "skincare", "oswego"
      ],
      bestVisualStyle: "before_after",
    },
  };

  const defaults = serviceDefaults[service || ""] || {};

  return {
    service: service || "all",
    recommendedHooks: defaults.recommendedHooks || [
      "Your transformation starts here",
      "The results speak for themselves",
      "Book your consultation today",
    ],
    recommendedHashtags: defaults.recommendedHashtags || [
      "medspa", "skincare", "beauty", "wellness", "selfcare",
      "hellogorgeousmedspa", "oswego", "transformation", "beautytips", "glow"
    ],
    recommendedCaptions: [
      "Start with the problem your audience faces",
      "Share the transformation journey",
      "End with a clear call to action",
    ],
    bestPostingTimes: ["7:00 PM", "12:00 PM", "9:00 AM"],
    bestVisualStyle: defaults.bestVisualStyle || "before_after",
    bestCaptionStyle: "educational_story",
    analysisNotes: "No campaign data yet. Using service-specific baseline recommendations.",
    confidenceScore: 0.6,
  };
}

// GET endpoint to retrieve recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");

    const supabase = await createClient();

    let query = supabase
      .from("campaign_recommendations")
      .select("*")
      .gte("expires_at", new Date().toISOString())
      .order("generated_at", { ascending: false });

    if (service) {
      query = query.eq("service", service);
    }

    const { data, error } = await query.limit(1).single();

    if (error) {
      if (error.code === "PGRST116" || error.code === "42P01") {
        // No recommendations found, generate defaults
        const defaults = await generateDefaultRecommendations(service || undefined);
        return NextResponse.json({ recommendations: defaults, fromDefaults: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ recommendations: data });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
