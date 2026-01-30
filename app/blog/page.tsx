import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BlogContent } from "./BlogContent";

export const metadata: Metadata = pageMetadata({
  title: "Blog & Resources",
  description:
    "Educational resources about Botox, fillers, weight loss, hormone therapy, and skincare from Hello Gorgeous Med Spa. Expert insights from Allergan, AnteAGE, Biote, and more.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogContent />;
}
