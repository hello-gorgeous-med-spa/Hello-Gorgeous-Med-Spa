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
  // CDN caching headers for static media
  headers: async () => [
    {
      source: "/.well-known/apple-developer-merchantid-domain-association",
      headers: [
        { key: "Content-Type", value: "application/json; charset=utf-8" },
        { key: "Access-Control-Allow-Origin", value: "*" },
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
    { source: "/your-care-team", destination: "/providers", permanent: true },
    { source: "/meet-the-team", destination: "/providers", permanent: true },
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
    { source: "/ez-prf-gel", destination: "/services/ez-prf-gel", permanent: true },
    { source: "/prp", destination: "/services/prp", permanent: true },
    { source: "/prp-facial", destination: "/services/prp-facial", permanent: true },
    { source: "/prp-joint-injections", destination: "/services/prp-joint-injections", permanent: true },
    // Hide GoDaddy member/login routes
    { source: "/m/:path*", destination: "/", permanent: true },
  ],
};

module.exports = nextConfig;
