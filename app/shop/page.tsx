import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ShopContent } from "./ShopContent";

export const metadata: Metadata = pageMetadata({
  title: "Shop",
  description:
    "Shop professional skincare, supplements, and wellness products from Hello Gorgeous Med Spa. Skinscript RX, Fullscript supplements, and Olympia Pharmacy products. Buy now, pay later with Cherry.",
  path: "/shop",
});

export default function ShopPage() {
  return <ShopContent />;
}
