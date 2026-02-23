/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Allow production builds to complete even with ESLint errors
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
    ],
  },
  // CDN caching headers for static media + global security headers
  headers: async () => [
    // Global security headers (all routes)
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        // CSP: allow self, inline scripts (Next.js), Supabase, Stripe, common CDNs; avoid blocking legitimate scripts
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://js.stripe.com https://challenges.cloudflare.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com wss://*.supabase.co",
            "frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
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
    { source: "/sitemap.website.xml", destination: "/sitemap.xml", permanent: true },
    { source: "/book-now", destination: "/book", permanent: true },
    { source: "/schedule", destination: "/book", permanent: true },
    { source: "/specials", destination: "/free-vitamin", permanent: true },
    { source: "/your-care-team", destination: "/providers", permanent: true },
    { source: "/meet-the-team", destination: "/providers", permanent: true },
    { source: "/care-and-support", destination: "/pre-post-care", permanent: true },
    // Sitemap/legacy URLs that have no page - redirect to avoid 404
    { source: "/pricing", destination: "/book", permanent: true },
    { source: "/gallery", destination: "/results", permanent: true },
    { source: "/faq", destination: "/contact", permanent: true },
    // Semaglutide/hormone-therapy/prp location URLs (no page) -> main service page
    { source: "/semaglutide-oswego-il", destination: "/services/weight-loss-therapy", permanent: true },
    { source: "/semaglutide-naperville-il", destination: "/services/weight-loss-therapy", permanent: true },
    { source: "/semaglutide-aurora-il", destination: "/services/weight-loss-therapy", permanent: true },
    { source: "/semaglutide-plainfield-il", destination: "/services/weight-loss-therapy", permanent: true },
    { source: "/semaglutide-yorkville-il", destination: "/services/weight-loss-therapy", permanent: true },
    { source: "/semaglutide-montgomery-il", destination: "/services/weight-loss-therapy", permanent: true },
    { source: "/hormone-therapy-naperville-il", destination: "/services/biote-hormone-therapy", permanent: true },
    { source: "/hormone-therapy-aurora-il", destination: "/services/biote-hormone-therapy", permanent: true },
    { source: "/prp-oswego-il", destination: "/services/prp", permanent: true },
    { source: "/prp-naperville-il", destination: "/services/prp", permanent: true },
    { source: "/prp-aurora-il", destination: "/services/prp", permanent: true },
    // med-spa-montgomery-il has no page (only 5 med-spa slugs in gbp-urls)
    { source: "/med-spa-montgomery-il", destination: "/montgomery-il", permanent: true },
    // GoDaddy legacy URLs (hellogorgeousmedspa.com)
    { source: "/home", destination: "/", permanent: true },
    { source: "/about-1", destination: "/about", permanent: true },
    { source: "/privacy-policy", destination: "/privacy", permanent: true },
    { source: "/botox%2C-dysport-%26-jeuveau", destination: "/services/botox-dysport-jeuveau", permanent: true },
    { source: "/botox-dysport", destination: "/services/botox-dysport-jeuveau", permanent: true },
    { source: "/lip-filler", destination: "/services/lip-filler", permanent: true },
    { source: "/weight-loss-glp-1", destination: "/services/weight-loss-therapy", permanent: true },
    { source: "/weight-loss-therapy", destination: "/services/weight-loss-therapy", permanent: true },
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
    { source: "/alle-botox-rewards", destination: "/services/alle-botox-rewards", permanent: true },
    // Solaria: aftercare content now lives on main /solaria page
    { source: "/aftercare/solaria-co2", destination: "/solaria", permanent: true },
    { source: "/ez-prf-gel", destination: "/services/ez-prf-gel", permanent: true },
    { source: "/prp", destination: "/services/prp", permanent: true },
    { source: "/prp-facial", destination: "/services/prp-facial", permanent: true },
    { source: "/prp-joint-injections", destination: "/services/prp-joint-injections", permanent: true },
    // Hide GoDaddy member/login routes
    { source: "/m/:path*", destination: "/", permanent: true },
  ],
};

module.exports = nextConfig;
