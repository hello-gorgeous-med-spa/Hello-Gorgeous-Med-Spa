const path = require("path");

/** Phase 4 — keep in sync with lib/city-seo-tier.ts DEINDEXED_CITY_REDIRECT_TARGETS */
const DEINDEXED_CITY_REDIRECT_TARGETS = {
  "sugar-grove": "aurora",
  ottawa: "yorkville",
  sandwich: "yorkville",
  bolingbrook: "naperville",
  geneva: "aurora",
  batavia: "aurora",
  "st-charles": "aurora",
  "north-aurora": "aurora",
};
const DEINDEXED_GBP_PREFIXES = ["botox", "lip-filler", "weight-loss", "med-spa"];

function buildDeindexedCityRedirects() {
  const rules = [];
  for (const [from, to] of Object.entries(DEINDEXED_CITY_REDIRECT_TARGETS)) {
    rules.push({ source: `/${from}-il`, destination: `/${to}-il`, permanent: true });
    for (const prefix of DEINDEXED_GBP_PREFIXES) {
      rules.push({
        source: `/${prefix}-${from}-il`,
        destination: `/${prefix}-${to}-il`,
        permanent: true,
      });
    }
  }
  return rules;
}

/** CSP for static HTML embedded in iframes on www (intake forms, education handouts). */
const EMBEDDABLE_HTML_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.supabase.co https://js.stripe.com https://challenges.cloudflare.com https://*.withcherry.com https://files.withcherry.com https://assistloop.ai",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com wss://*.supabase.co https://*.withcherry.com https://assistloop.ai https://*.assistloop.ai wss://*.assistloop.ai",
  "frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com https://www.alle.com https://*.alle.com https://*.withcherry.com https://pay.withcherry.com https://www.facebook.com https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://assistloop.ai https://*.assistloop.ai",
  "frame-ancestors 'self' https://www.hellogorgeousmedspa.com https://hellogorgeousmedspa.com https://hub.hellogorgeousmedspa.com",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["web-push"],
  // Pin tracing to this app when a parent folder also has a package-lock.json
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even with type errors
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    // Mitigate GHSA-3x4c-7xq6-9pq8 (unbounded image cache): reduce variant cardinality
    formats: ["image/webp"],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 128, 256],
  },
  // CDN caching headers for static media + global security headers
  headers: async () => [
    // Global security headers — do NOT use source "/(.*)": that matches /docs/* and stacks a second CSP.
    // Multiple CSPs are intersected; frame-ancestors 'none' (global) + explicit hosts (/docs) still forbids iframes.
    // Exempt: embeddable HTML (public/docs, public/forms, education handouts, RE GEN site) — see dedicated blocks below.
    {
      source: "/((?!docs$|docs/|forms/|handouts/education/|regen-site/|flowwave-site/|flowwave-brochure-site/).*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
        // CSP: allow self, inline scripts (Next.js), Supabase, Stripe, WithCherry, common CDNs; avoid blocking legitimate scripts
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.supabase.co https://js.stripe.com https://challenges.cloudflare.com https://*.withcherry.com https://files.withcherry.com https://assistloop.ai",
            "worker-src 'self' blob:",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com wss://*.supabase.co https://*.withcherry.com https://assistloop.ai https://*.assistloop.ai wss://*.assistloop.ai",
            "frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com https://www.alle.com https://*.alle.com https://*.withcherry.com https://pay.withcherry.com https://www.facebook.com https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://assistloop.ai https://*.assistloop.ai",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
    // Classic Command Center HTML — override global DENY / frame-ancestors for /hub/classic iframe
    {
      source: "/hub/command-center.html",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.supabase.co https://js.stripe.com https://challenges.cloudflare.com https://*.withcherry.com https://files.withcherry.com https://assistloop.ai",
            "worker-src 'self' blob:",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com wss://*.supabase.co https://*.withcherry.com https://assistloop.ai https://*.assistloop.ai wss://*.assistloop.ai",
            "frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com https://www.alle.com https://*.alle.com https://*.withcherry.com https://pay.withcherry.com https://www.facebook.com https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://assistloop.ai https://*.assistloop.ai",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
    // Verbatim consent (public/docs) — only CSP (no X-Frame-Options) so it can be iframed on hub + www
    {
      source: "/docs/:path*",
      headers: [{ key: "Content-Security-Policy", value: EMBEDDABLE_HTML_CSP }],
    },
    // Brow intake + other public forms (iframes on /forms/brow-intake etc.)
    {
      source: "/forms/:path*",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Content-Security-Policy", value: EMBEDDABLE_HTML_CSP },
      ],
    },
    // Education handouts embedded on /education/your-brow-journey
    {
      source: "/handouts/education/:path*",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Content-Security-Policy", value: EMBEDDABLE_HTML_CSP },
      ],
    },
    // RE GEN site (public/regen-site) — the prescription-arm prototype iframed on /rx.
    // Needs SAMEORIGIN framing + 'self' scripts (React/ReactDOM/Babel are vendored under
    // /regen-site/vendor) so it isn't blocked by the global DENY / unpkg-less script-src.
    // noindex: the canonical indexable URL is /rx — this raw client-rendered shell must not
    // compete as a thin duplicate. It stays crawlable so Googlebot can still render the iframe.
    {
      source: "/regen-site/:path*",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Robots-Tag", value: "noindex" },
        { key: "Content-Security-Policy", value: EMBEDDABLE_HTML_CSP },
      ],
    },
    // FlowWave site (public/flowwave-site) — shockwave therapy landing iframed on /services/flowwave.
    {
      source: "/flowwave-site/:path*",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Robots-Tag", value: "noindex" },
        { key: "Content-Security-Policy", value: EMBEDDABLE_HTML_CSP },
      ],
    },
    // FlowWave brochure (public/flowwave-brochure-site) — iframed on /services/flowwave/brochure.
    {
      source: "/flowwave-brochure-site/:path*",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Robots-Tag", value: "noindex" },
        { key: "Content-Security-Policy", value: EMBEDDABLE_HTML_CSP },
      ],
    },
    // In-spa RE GEN TV loop (public/regen-tv.html) — fullscreen slideshow for waiting-room displays.
    {
      source: "/regen-tv.html",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Robots-Tag", value: "noindex" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https:",
            "media-src 'self' blob:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self'",
            "frame-ancestors 'self'",
          ].join("; "),
        },
      ],
    },
    // Staff tools (public/staff) — Pharmacy Selector and other bundled tools.
    // Needs blob: URLs for Claude artifact bundler to work.
    {
      source: "/staff/:path*.html",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Robots-Tag", value: "noindex" },
        { key: "Content-Security-Policy", value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
          "worker-src 'self' blob:",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' blob:",
          "frame-ancestors 'self'",
        ].join("; ") },
      ],
    },
    {
      source: "/.well-known/apple-developer-merchantid-domain-association",
      headers: [
        { key: "Content-Type", value: "text/plain" },
      ],
    },
    {
      source: "/videos/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        { key: "CDN-Cache-Control", value: "public, max-age=31536000" },
      ],
    },
    {
      source: "/images/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        { key: "CDN-Cache-Control", value: "public, max-age=31536000" },
      ],
    },
  ],
  rewrites: async () => [],
  redirects: async () => [
    { source: "/regen-tv", destination: "/regen-tv.html", permanent: false },
    { source: "/rx/dermatology", destination: "/rx/hair-skin", permanent: true },
    { source: "/sitemap.website.xml", destination: "/sitemap.xml", permanent: true },
    { source: "/hydrafacial-oswego-il", destination: "/facials-oswego", permanent: true },
    { source: "/vitamin-bar", destination: "/app?tab=vitamin", permanent: false },
    { source: "/events/the-glow-social", destination: "/book", permanent: true },
    { source: "/events/vip-device-night", destination: "/book", permanent: true },
    { source: "/book-now", destination: "/book", permanent: true },
    { source: "/refill", destination: "/rx/care", permanent: true },
    { source: "/refills", destination: "/rx/care", permanent: true },
    { source: "/patient-care", destination: "/rx/care", permanent: true },
    { source: "/mens-wellness", destination: "/gentlemens-club", permanent: true },
    { source: "/mens-hormones", destination: "/gentlemens-club", permanent: true },
    { source: "/blood-panels", destination: "/blood-work", permanent: true },
    { source: "/medical/blood-panels", destination: "/blood-work", permanent: true },
    { source: "/peptide-therapy-men", destination: "/peptides", permanent: true },
    { source: "/schedule", destination: "/book", permanent: true },
    { source: "/signature-treatment-menu", destination: "/specials", permanent: true },
    { source: "/vip-skin-tightening", destination: "/contour-lift/inquiry", permanent: true },
    { source: "/solaria-co2-vip", destination: "/solaria-co2-oswego", permanent: true },
    { source: "/trifecta-vip", destination: "/specials", permanent: true },
    { source: "/vip", destination: "/book", permanent: true },
    {
      source: "/blog/male-female-practitioners-med-spa-advantage",
      destination: "/blog/male-female-practitioners-med-spa-advantage-oswego-il",
      permanent: true,
    },
    {
      source: "/blog/what-makes-hello-gorgeous-different",
      destination: "/blog/what-makes-hello-gorgeous-different-oswego-il",
      permanent: true,
    },
    {
      source: "/blog/founder-letter-morpheus-solaria",
      destination: "/blog/founder-letter-morpheus8-solaria-oswego-il",
      permanent: true,
    },
    {
      source: "/blog/founder-letter-morpheus8-solaria",
      destination: "/blog/founder-letter-morpheus8-solaria-oswego-il",
      permanent: true,
    },
    { source: "/services/regenerative", destination: "/regenerative-medicine-oswego-il", permanent: true },
    { source: "/your-care-team", destination: "/providers", permanent: true },
    { source: "/care-and-support", destination: "/pre-post-care", permanent: true },
    // Sitemap/legacy URLs that have no page - redirect to avoid 404
    { source: "/pricing", destination: "/book", permanent: true },
    { source: "/pharmacy-partner", destination: "/products-we-offer", permanent: true },
    // Semaglutide/hormone-therapy/prp location URLs (no page) -> main service page
    { source: "/semaglutide-oswego-il", destination: "/glp1-weight-loss", permanent: true },
    { source: "/semaglutide-naperville-il", destination: "/glp1-weight-loss", permanent: true },
    { source: "/semaglutide-aurora-il", destination: "/glp1-weight-loss", permanent: true },
    { source: "/semaglutide-plainfield-il", destination: "/glp1-weight-loss", permanent: true },
    { source: "/semaglutide-yorkville-il", destination: "/glp1-weight-loss", permanent: true },
    { source: "/semaglutide-montgomery-il", destination: "/glp1-weight-loss", permanent: true },
    { source: "/hormone-therapy-naperville-il", destination: "/services/biote-hormone-therapy", permanent: true },
    { source: "/hormone-therapy-aurora-il", destination: "/services/biote-hormone-therapy", permanent: true },
    { source: "/prp-oswego-il", destination: "/services/prp", permanent: true },
    { source: "/prp-naperville-il", destination: "/services/prp", permanent: true },
    { source: "/prp-aurora-il", destination: "/services/prp", permanent: true },
    // GoDaddy legacy URLs (hellogorgeousmedspa.com)
    { source: "/home", destination: "/", permanent: true },
    { source: "/about-1", destination: "/about", permanent: true },
    { source: "/privacy-policy", destination: "/privacy", permanent: true },
    // HG_DEV_011 — individual service SEO URLs (canonical Oswego slugs)
    { source: "/services/botox-dysport-jeuveau", destination: "/botox-oswego", permanent: true },
    { source: "/botox%2C-dysport-%26-jeuveau", destination: "/botox-oswego", permanent: true },
    { source: "/botox-dysport", destination: "/botox-oswego", permanent: true },
    { source: "/botox-oswego-il", destination: "/botox-oswego", permanent: true },
    { source: "/peptide-therapy-oswego-il", destination: "/peptide-therapy-oswego", permanent: true },
    { source: "/services/morpheus8-burst", destination: "/morpheus8-burst-oswego", permanent: true },
    { source: "/services/morpheus8", destination: "/morpheus8-burst-oswego", permanent: true },
    { source: "/services/solaria-co2", destination: "/solaria-co2-oswego", permanent: true },
    { source: "/co2-laser-oswego-il", destination: "/solaria-co2-oswego", permanent: true },
    { source: "/solaria-co2-laser-oswego-il", destination: "/solaria-co2-oswego", permanent: true },
    { source: "/stretch-mark-treatment-oswego-il", destination: "/solaria-co2-oswego", permanent: true },
    { source: "/services/quantum-rf", destination: "/quantum-rf-oswego", permanent: true },
    { source: "/services/weight-loss", destination: "/glp-1-weight-loss-oswego", permanent: true },
    { source: "/services/weight-loss-therapy", destination: "/glp-1-weight-loss-oswego", permanent: true },
    { source: "/services/hormone-therapy", destination: "/biote-hormone-therapy-oswego", permanent: true },
    { source: "/services/biote-hormone-therapy", destination: "/biote-hormone-therapy-oswego", permanent: true },
    { source: "/lip-filler", destination: "/services/lip-filler", permanent: true },
    { source: "/weight-loss-glp-1", destination: "/glp1-weight-loss", permanent: true },
    { source: "/weight-loss-therapy", destination: "/glp1-weight-loss", permanent: true },
    { source: "/services/weight-loss-therapy", destination: "/glp1-weight-loss", permanent: true },
    { source: "/hormone-therapy", destination: "/services/biote-hormone-therapy", permanent: true },
    { source: "/biote-hormone-therapy", destination: "/services/biote-hormone-therapy", permanent: true },
    { source: "/trt-replacement-therapy", destination: "/services/trt-replacement-therapy", permanent: true },
    { source: "/sermorelin-growth-peptide", destination: "/peptides", permanent: true },
    { source: "/services/sermorelin-growth-peptide", destination: "/peptides", permanent: true },
    { source: "/iv-therapy", destination: "/services/iv-therapy", permanent: true },
    { source: "/vitamin-injections", destination: "/services/vitamin-injections", permanent: true },
    { source: "/rf-microneedling", destination: "/services/rf-microneedling", permanent: true },
    { source: "/chemical-peels", destination: "/services/chemical-peels", permanent: true },
    { source: "/hydra-facial", destination: "/services/hydra-facial", permanent: true },
    { source: "/geneo-facial", destination: "/services/geneo-facial", permanent: true },
    { source: "/ipl-photofacial", destination: "/services/ipl-photofacial", permanent: true },
    { source: "/laser-hair-removal", destination: "/services/laser-hair-removal", permanent: true },
    { source: "/kybella", destination: "/services/kybella", permanent: true },
    { source: "/salmon-dna-glass-facial", destination: "/services/salmon-dna-glass-facial", permanent: true },
    { source: "/salmon-dna-oswego", destination: "/salmon-dna-oswego-il", permanent: true },
    { source: "/sculptra-oswego", destination: "/sculptra-oswego-il", permanent: true },
    { source: "/lumecca-ipl-oswego-il", destination: "/ipl-photofacial-oswego-il", permanent: true },
    { source: "/lumecca-ipl-oswego", destination: "/services/ipl-photofacial", permanent: true },
    { source: "/biostimulator-oswego-il", destination: "/sculptra-oswego-il", permanent: true },
    { source: "/alle-botox-rewards", destination: "/services/alle-botox-rewards", permanent: true },
    // Solaria: aftercare content now lives on main /solaria page
    { source: "/aftercare/solaria-co2", destination: "/solaria", permanent: true },
    { source: "/ez-prf-gel", destination: "/services/ez-prf-gel", permanent: true },
    { source: "/prp", destination: "/services/prp", permanent: true },
    { source: "/prp-facial", destination: "/services/prp-facial", permanent: true },
    { source: "/prp-joint-injections", destination: "/services/prp-joint-injections", permanent: true },
    // Hide GoDaddy member/login routes
    { source: "/m/:path*", destination: "/", permanent: true },
    // Legacy URLs from old site (404 in Search Console) — redirect to current equivalents
    { source: "/shop-1", destination: "/shop", permanent: true },
    { source: "/shop-1/:path*", destination: "/shop", permanent: true },
    { source: "/skinscript-rx", destination: "/shop", permanent: true },
    { source: "/anteage", destination: "/shop", permanent: true },
    { source: "/migrane-%26-trigger-points", destination: "/pre-post-care/trigger-point", permanent: true },
    { source: "/migraine-%26-trigger-points", destination: "/pre-post-care/trigger-point", permanent: true },
    { source: "/dermaplanning", destination: "/services/lash-spa", permanent: true },
    { source: "/womens-health", destination: "/rx/hormones", permanent: true },
    { source: "/womens-health-2", destination: "/rx/hormones", permanent: true },
    { source: "/f/:path*", destination: "/blog", permanent: true },
    // Additional legacy 404s (batch 2)
    { source: "/privacy-policy-1", destination: "/privacy", permanent: true },
    { source: "/privacy-policy-2", destination: "/privacy", permanent: true },
    { source: "/cryo-frotox-facial", destination: "/services/geneo-facial", permanent: true },
    { source: "/perimenopause-therapy", destination: "/rx/hormones", permanent: true },
    { source: "/pituitary-imbalance-help", destination: "/rx/hormones", permanent: true },
    { source: "/skin-tightening", destination: "/services/morpheus8", permanent: true },
    { source: "/hello-gorgeous-signature", destination: "/services/hydra-facial", permanent: true },
    // Additional legacy 404s (batch 3)
    { source: "/facials", destination: "/services/hydra-facial", permanent: true },
    { source: "/rx/vitamins", destination: "/rx/wellness", permanent: true },
    { source: "/womens-health-1", destination: "/rx/hormones", permanent: true },
    { source: "/waxing", destination: "/services/lash-spa", permanent: true },
    { source: "/3-in-1-elite-trio-1", destination: "/solaria-packages", permanent: true },
    { source: "/menopause-therapy", destination: "/rx/hormones", permanent: true },
    { source: "/o-shot-rejuvenation", destination: "/rx", permanent: true },
    { source: "/botox-fillers", destination: "/botox-oswego", permanent: true },
    // Phase 4 — thin far-flung city pages → nearest primary Fox Valley hub
    ...buildDeindexedCityRedirects(),
  ],
};

module.exports = nextConfig;
