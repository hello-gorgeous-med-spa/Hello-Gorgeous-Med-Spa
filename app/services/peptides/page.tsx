import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PeptideCatalog } from "./PeptideCatalog";

export const metadata: Metadata = pageMetadata({
  title: "Peptide Therapy Catalog | Hello Gorgeous Med Spa | Oswego, IL",
  description:
    "Explore medically supervised peptide therapies at Hello Gorgeous Med Spa in Oswego, IL — fat loss, recovery, brain health, and sexual wellness peptides tailored to your goals.",
  path: "/services/peptides",
  keywords: [
    "peptide therapy Oswego IL",
    "semaglutide tirzepatide near me",
    "BPC-157 recovery peptides",
    "NAD+ therapy Illinois",
    "peptide catalog med spa",
  ],
});

export default function PeptidesPage() {
  return <PeptideCatalog />;
}
