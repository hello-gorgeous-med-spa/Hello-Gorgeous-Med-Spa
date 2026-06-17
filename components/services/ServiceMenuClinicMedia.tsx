"use client";

import { useId } from "react";

import { BeforeAfterResultsColumn } from "@/components/services/BeforeAfterResultsColumn";
import { ClinicalPhotoCarousel } from "@/components/services/ClinicalPhotoCarousel";
import type {
  ServiceMenuGallerySlide,
  ServiceMenuResultSlide,
  ServiceMenuVideo,
} from "@/lib/service-menu-types";
import { ServiceMenuVideos, VideoCard } from "@/components/services/ServiceMenuVideos";

function MediaSectionHeader({
  titleId,
  eyebrow,
  title,
  subtitle,
}: {
  titleId: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 text-center md:mb-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">{eyebrow}</p>
      <h2 id={titleId} className="mt-2 font-serif text-xl md:text-2xl text-white">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}

export function ServiceMenuClinicMedia({
  videos,
  gallery,
  results = [],
  title = "See it in our Oswego clinic",
  subtitle = "Real procedure footage and clinic photography — watch before your free consultation.",
  eyebrow = "InMode · Verified Provider",
}: {
  videos: ServiceMenuVideo[];
  gallery: ServiceMenuGallerySlide[];
  results?: ServiceMenuResultSlide[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  const titleId = useId();
  const hasVideos = videos.length > 0;
  const hasGallery = gallery.length > 0;
  const hasResults = results.length > 0;

  if (!hasVideos && !hasGallery && !hasResults) return null;

  const header = (
    <MediaSectionHeader titleId={titleId} eyebrow={eyebrow} title={title} subtitle={subtitle} />
  );

  /* Trifecta sync row: video · clinic photos · before/after results */
  if (hasResults && (hasVideos || hasGallery)) {
    const columnCount = [hasVideos, hasGallery, hasResults].filter(Boolean).length;

    return (
      <div className="w-full" aria-labelledby={titleId}>
        {header}
        <div
          className={`grid gap-4 md:items-stretch md:gap-4 ${
            columnCount >= 3
              ? "lg:grid-cols-3"
              : columnCount === 2
                ? "md:grid-cols-2"
                : "grid-cols-1"
          }`}
        >
          {hasVideos && videos.length === 1 ? (
            <VideoCard video={videos[0]} layout="split" />
          ) : hasVideos && !hasGallery && hasResults ? (
            videos.map((video) => <VideoCard key={video.src} video={video} layout="split" />)
          ) : hasVideos ? (
            <div className="flex min-h-0 flex-col gap-4 lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-4">
              {videos.map((video) => (
                <VideoCard key={video.src} video={video} layout="split" />
              ))}
            </div>
          ) : null}
          {hasGallery ? <ClinicalPhotoCarousel slides={gallery} embedded label="Clinic photos" /> : null}
          {hasResults ? <BeforeAfterResultsColumn slides={results} embedded label="Client results" /> : null}
        </div>
      </div>
    );
  }

  if (hasVideos && hasGallery && videos.length === 1) {
    return (
      <div className="w-full" aria-labelledby={titleId}>
        {header}
        <div className="grid gap-4 md:grid-cols-2 md:items-stretch md:gap-5">
          <VideoCard video={videos[0]} layout="split" />
          <ClinicalPhotoCarousel slides={gallery} embedded label="Clinic photos" />
        </div>
      </div>
    );
  }

  if (hasVideos) {
    return <ServiceMenuVideos videos={videos} title={title} subtitle={subtitle} />;
  }

  if (hasGallery) {
    return <ClinicalPhotoCarousel slides={gallery} title={title} />;
  }

  return (
    <div className="w-full" aria-labelledby={titleId}>
      {header}
      <BeforeAfterResultsColumn slides={results} embedded={false} label="Client results" />
    </div>
  );
}
