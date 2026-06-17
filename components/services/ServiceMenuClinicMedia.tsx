"use client";

import { useId } from "react";

import { ClinicalPhotoCarousel } from "@/components/services/ClinicalPhotoCarousel";
import type { ServiceMenuGallerySlide, ServiceMenuVideo } from "@/lib/service-menu-types";
import { ServiceMenuVideos, VideoCard } from "@/components/services/ServiceMenuVideos";

export function ServiceMenuClinicMedia({
  videos,
  gallery,
  title = "See it in our Oswego clinic",
  subtitle = "Real procedure footage and clinic photography — watch before your free consultation.",
  eyebrow = "InMode · Verified Provider",
}: {
  videos: ServiceMenuVideo[];
  gallery: ServiceMenuGallerySlide[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  const titleId = useId();
  const hasVideos = videos.length > 0;
  const hasGallery = gallery.length > 0;

  if (!hasVideos && !hasGallery) return null;

  if (hasVideos && hasGallery && videos.length === 1) {
    return (
      <div className="w-full" aria-labelledby={titleId}>
        <div className="mb-6 text-center md:mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">{eyebrow}</p>
          <h2 id={titleId} className="mt-2 font-serif text-xl md:text-2xl text-white">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-400">{subtitle}</p>
        </div>
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

  return <ClinicalPhotoCarousel slides={gallery} title={title} />;
}
