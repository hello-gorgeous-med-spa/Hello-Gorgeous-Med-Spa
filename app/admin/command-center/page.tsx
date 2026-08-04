import type { Metadata } from "next";
import { Suspense } from "react";
import CommandCenterClient from "@/components/admin/CommandCenterClient";

export const metadata: Metadata = {
  title: "Team | Hello Gorgeous",
  description: "Team Hub, practice overview, and marketing ops",
  robots: { index: false, follow: false },
};

export default function CommandCenterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF5F9]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF2D8E] border-t-transparent" />
        </div>
      }
    >
      <CommandCenterClient />
    </Suspense>
  );
}
