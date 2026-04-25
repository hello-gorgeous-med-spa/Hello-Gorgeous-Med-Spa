"use client";

import { useParams } from "next/navigation";
import { PublicHgForm } from "@/components/forms/PublicHgForm";

export default function PublicFormPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  if (!slug) return null;
  return <PublicHgForm formSlug={slug} variant="default" />;
}
