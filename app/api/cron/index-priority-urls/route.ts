// ============================================================
// CRON: Index Priority URLs
// Submits sitemap + inspects top blog & service URLs via Search Console API
// Schedule: Daily at 6 AM CT
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  defaultSitemapUrl,
  getAccessToken,
  getSitemapStatus,
  inspectUrl,
  listSites,
  pickPropertyForSite,
  submitSitemap,
} from "@/lib/seo/search-console";
import { getAllSlugs } from "@/data/blog-posts";
import { SITE } from "@/lib/seo";
import { SERVICE_PAGE_OSWEGO_SLUGS } from "@/lib/service-pages-oswego";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PRIORITY_SERVICE_URLS = [
  "/botox-oswego",
  "/botox-oswego-il",
  "/botox-naperville-il",
  "/botox-aurora-il",
  "/botox-plainfield-il",
  "/botox-yorkville-il",
  "/services/botox",
  "/peptides",
  "/peptide-therapy-oswego",
  "/peptides/bpc-157",
  "/peptides/sermorelin",
  "/peptides/ghk-cu-injectable",
  "/injection-menu",
  ...SERVICE_PAGE_OSWEGO_SLUGS.map((slug) => `/${slug}`),
  "/services/morpheus8",
  "/services/quantum-rf",
  "/services/solaria-co2",
  "/glp1-weight-loss",
  "/our-promise",
  "/microblading-brow-pmu-oswego-il",
  "/education/your-brow-journey",
  "/aurora-il",
  "/naperville-il",
  "/oswego-il",
  "/best-med-spa-oswego-il",
  "/montgomery-il",
  "/plainfield-il",
  "/yorkville-il",
  "/botox-montgomery-il",
  "/weight-loss-montgomery-il",
  "/weight-loss-plainfield-il",
  "/weight-loss-yorkville-il",
  "/body-sculpting-oswego-il",
];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accessToken = await getAccessToken();
    const sites = await listSites(accessToken);
    const property = pickPropertyForSite(sites);
    
    if (!property) {
      return NextResponse.json({
        ok: false,
        error: "No verified Search Console property found",
        availableSites: sites.map(s => s.siteUrl),
      }, { status: 500 });
    }

    // 1. Submit sitemap
    const sitemapUrl = defaultSitemapUrl();
    const submitResult = await submitSitemap(accessToken, property.siteUrl, sitemapUrl);
    const sitemapStatus = await getSitemapStatus(accessToken, property.siteUrl, sitemapUrl);

    // 2. Get top 10 blog slugs (newest first)
    const allBlogSlugs = getAllSlugs();
    const topBlogUrls = allBlogSlugs.slice(0, 10).map(slug => `/blog/${slug}`);

    // 3. Combine priority URLs
    const allPriorityUrls = [...PRIORITY_SERVICE_URLS, ...topBlogUrls];

    // 4. Inspect each URL (rate limit: space them out)
    const inspections: Array<{
      url: string;
      verdict?: string;
      coverage?: string;
      indexed?: boolean;
      lastCrawl?: string;
      error?: string;
    }> = [];

    for (const path of allPriorityUrls) {
      const fullUrl = `${SITE.url}${path}`;
      try {
        const result = await inspectUrl(accessToken, property.siteUrl, fullUrl);
        const verdict = result.indexStatusResult?.verdict;
        const coverage = result.indexStatusResult?.coverageState;
        
        inspections.push({
          url: path,
          verdict,
          coverage,
          indexed: verdict === "PASS" || coverage === "Submitted and indexed",
          lastCrawl: result.indexStatusResult?.lastCrawlTime,
        });
      } catch (e) {
        inspections.push({
          url: path,
          error: e instanceof Error ? e.message : String(e),
        });
      }
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    }

    const indexedCount = inspections.filter(i => i.indexed).length;
    const notIndexedUrls = inspections.filter(i => !i.indexed && !i.error).map(i => i.url);

    return NextResponse.json({
      ok: true,
      property: property.siteUrl,
      sitemap: {
        url: sitemapUrl,
        submitted: submitResult.ok,
        lastSubmitted: sitemapStatus?.lastSubmitted,
        urlCount: sitemapStatus?.contents?.[0]?.submitted,
      },
      inspections: {
        total: inspections.length,
        indexed: indexedCount,
        notIndexed: notIndexedUrls.length,
        notIndexedUrls: notIndexedUrls.slice(0, 20),
      },
      details: inspections,
      timestamp: new Date().toISOString(),
    });

  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    }, { status: 500 });
  }
}
