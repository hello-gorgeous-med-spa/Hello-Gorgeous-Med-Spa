import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/hgos/supabase";
import { promoteApprovedBlogSocialPostsToQueue } from "@/lib/hgos/blog-social-to-scheduled";
import { blogPosts, getPostBySlug } from "@/data/blog-posts";

function getDb() {
  return createAdminSupabaseClient() ?? createServerSupabaseClient();
}

const SITE_URL = "https://www.hellogorgeousmedspa.com";

const HASHTAGS = [
  "#HelloGorgeousMedSpa", "#OswegoIL", "#MedSpa",
  "#InModeTrifecta", "#SkinTightening", "#Morpheus8Burst",
  "#SolariaCO2", "#QuantumRF", "#NurseInjector", "#AestheticMedicine",
  "#GLP1WeightLoss", "#Semaglutide", "#BodyContouring",
  "#SkinCare", "#AntiAging", "#FoxValley", "#NapervilleIL",
];

function pickHashtags(keywords: string[], count = 10): string[] {
  const relevant = HASHTAGS.filter((h) =>
    keywords.some((k) => h.toLowerCase().includes(k.toLowerCase().split(" ")[0]))
  );
  const remaining = HASHTAGS.filter((h) => !relevant.includes(h));
  return [...relevant, ...remaining].slice(0, count);
}

function generateInstagramCaption(post: typeof blogPosts[0]): string {
  const hashtags = pickHashtags(post.keywords, 12);
  return `${post.title}\n\n${post.excerpt}\n\n📍 Hello Gorgeous Med Spa — Oswego, IL\n📞 630-636-6193\n🌐 Link in bio\n\nNP on site 7 days a week. Same-day consultations.\n\n${hashtags.join(" ")}`;
}

function generateFacebookCaption(post: typeof blogPosts[0]): string {
  return `${post.title}\n\n${post.excerpt}\n\nRead the full article: ${SITE_URL}/blog/${post.slug}\n\n📍 Hello Gorgeous Med Spa\n74 W Washington St, Oswego, IL 60543\n📞 630-636-6193\n\nBook your free consultation: ${SITE_URL}/book`;
}

function generateGoogleCaption(post: typeof blogPosts[0]): string {
  const text = `${post.title} — ${post.excerpt}`;
  return text.substring(0, 1400) + `\n\nRead more: ${SITE_URL}/blog/${post.slug}`;
}

// POST: Generate social posts for a specific blog article (or all)
// Body: { action: "promote-queue" } — copy approved rows into scheduled_social_posts for cron
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "promote-queue") {
      const admin = createAdminSupabaseClient();
      if (!admin) {
        return NextResponse.json({ error: "Database not configured (service role required)" }, { status: 503 });
      }
      const promote = await promoteApprovedBlogSocialPostsToQueue(admin);
      return NextResponse.json({ success: true, promote });
    }

    const { slug, generateAll } = body;

    const posts = generateAll
      ? blogPosts
      : slug ? [getPostBySlug(slug)].filter(Boolean) : [];

    if (posts.length === 0) {
      return NextResponse.json({ error: "No blog post found" }, { status: 404 });
    }

    const supabase = getDb();
    const generated: Array<{ slug: string; platforms: string[] }> = [];

    for (const post of posts) {
      if (!post) continue;

      const platforms = [
        {
          channel: "instagram",
          message: generateInstagramCaption(post),
          link: `${SITE_URL}/blog/${post.slug}`,
        },
        {
          channel: "facebook",
          message: generateFacebookCaption(post),
          link: `${SITE_URL}/blog/${post.slug}`,
        },
        {
          channel: "google",
          message: generateGoogleCaption(post),
          link: `${SITE_URL}/blog/${post.slug}`,
        },
      ];

      const scheduledAt = new Date();
      scheduledAt.setHours(scheduledAt.getHours() + 1);

      if (supabase) {
        for (const platform of platforms) {
          // Check if draft already exists for this slug + channel
          const { data: existing } = await supabase
            .from("blog_social_posts")
            .select("id")
            .eq("blog_slug", post.slug)
            .eq("channel", platform.channel)
            .maybeSingle();

          if (existing) continue;

          await supabase.from("blog_social_posts").insert({
            blog_slug: post.slug,
            blog_title: post.title,
            channel: platform.channel,
            message: platform.message,
            link: platform.link,
            status: "draft",
            scheduled_at: scheduledAt.toISOString(),
          });
        }
      }

      generated.push({
        slug: post.slug,
        platforms: platforms.map((p) => p.channel),
      });
    }

    return NextResponse.json({
      success: true,
      generated: generated.length,
      posts: generated,
    });
  } catch (error) {
    console.error("[Blog-to-Social] Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

// GET: List all blog social post drafts
export async function GET() {
  try {
    const supabase = getDb();
    if (!supabase) {
      // Fallback: return template-generated data without DB
      const posts = blogPosts.map((post) => ({
        blog_slug: post.slug,
        blog_title: post.title,
        channels: {
          instagram: { message: generateInstagramCaption(post), status: "not_generated" },
          facebook: { message: generateFacebookCaption(post), status: "not_generated" },
          google: { message: generateGoogleCaption(post), status: "not_generated" },
        },
      }));
      return NextResponse.json({ posts, fromTemplate: true });
    }

    const { data: socialPosts } = await supabase
      .from("blog_social_posts")
      .select("*")
      .order("created_at", { ascending: false });

    // Group by blog slug
    const grouped: Record<string, {
      blog_slug: string;
      blog_title: string;
      channels: Record<string, { id: string; message: string; status: string; scheduled_at: string; posted_at?: string }>;
    }> = {};

    for (const sp of socialPosts || []) {
      if (!grouped[sp.blog_slug]) {
        grouped[sp.blog_slug] = {
          blog_slug: sp.blog_slug,
          blog_title: sp.blog_title,
          channels: {},
        };
      }
      grouped[sp.blog_slug].channels[sp.channel] = {
        id: sp.id,
        message: sp.message,
        status: sp.status,
        scheduled_at: sp.scheduled_at,
        posted_at: sp.posted_at,
      };
    }

    // Add blog posts that haven't been generated yet
    for (const post of blogPosts) {
      if (!grouped[post.slug]) {
        grouped[post.slug] = {
          blog_slug: post.slug,
          blog_title: post.title,
          channels: {},
        };
      }
    }

    return NextResponse.json({
      posts: Object.values(grouped),
      totalBlogs: blogPosts.length,
    });
  } catch (error) {
    console.error("[Blog-to-Social] GET Error:", error);
    return NextResponse.json({ posts: [] });
  }
}

// PATCH: Approve, edit, or schedule a social post
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, message, scheduled_at } = body;

    const supabase = getDb();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    if (action === "approve") {
      await supabase
        .from("blog_social_posts")
        .update({ status: "approved", scheduled_at: scheduled_at || new Date().toISOString() })
        .eq("id", id);
    } else if (action === "edit") {
      await supabase
        .from("blog_social_posts")
        .update({ message })
        .eq("id", id);
    } else if (action === "approve-all") {
      // Approve all drafts
      const scheduleTime = new Date();
      await supabase
        .from("blog_social_posts")
        .update({ status: "approved", scheduled_at: scheduleTime.toISOString() })
        .eq("status", "draft");
    }

    let promote: Awaited<ReturnType<typeof promoteApprovedBlogSocialPostsToQueue>> | undefined;
    const admin = createAdminSupabaseClient();
    if (admin && (action === "approve" || action === "approve-all")) {
      promote = await promoteApprovedBlogSocialPostsToQueue(admin);
    }

    return NextResponse.json({ success: true, promote });
  } catch (error) {
    console.error("[Blog-to-Social] PATCH Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
