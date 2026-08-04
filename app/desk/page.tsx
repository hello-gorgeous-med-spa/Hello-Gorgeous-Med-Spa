import type { Metadata } from "next";
import DeskPortalHome from "@/components/desk/DeskPortalHome";

export const metadata: Metadata = {
  title: "Desk | Hello Gorgeous",
  description: "Hello Gorgeous Desk — one front door for the business",
  robots: { index: false, follow: false },
};

export default function DeskPage() {
  return <DeskPortalHome />;
}
