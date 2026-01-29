/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Add real CDNs/domains here as needed
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  redirects: async () => [
    { source: "/book-now", destination: "/book", permanent: true },
    { source: "/schedule", destination: "/book", permanent: true },
    { source: "/your-care-team", destination: "/meet-the-team", permanent: true },
  ],
};

module.exports = nextConfig;