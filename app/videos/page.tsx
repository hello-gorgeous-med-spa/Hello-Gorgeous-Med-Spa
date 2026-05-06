import type { Metadata } from "next";
import { VideoLibraryClient } from "@/components/video/VideoLibraryClient";
import { pageMetadata, SITE, siteJsonLd } from "@/lib/seo";
import { VIDEO_LIBRARY } from "@/lib/video-library";

export const metadata: Metadata = pageMetadata({
  title: "Video Library | Hello Gorgeous Med Spa",
  description:
    "Searchable provider reels, educational videos, FAQ clips, and treatment walkthrough transcripts for Hello Gorgeous Med Spa services.",
  path: "/videos",
});

export default function VideosLibraryPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hello Gorgeous Video Library",
    itemListElement: VIDEO_LIBRARY.map((video, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.summary,
        embedUrl: video.embedUrl,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        url: `${SITE.url}/videos`,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-black text-black">Hello Gorgeous Video Library</h1>
        <p className="mt-3 max-w-3xl text-black/75">
          Search by concern, treatment type, or transcript language. This library is structured so AI/search systems can index video context rather than just social snippets.
        </p>
        <div className="mt-7">
          <VideoLibraryClient videos={VIDEO_LIBRARY} />
        </div>
      </main>
    </>
  );
}
