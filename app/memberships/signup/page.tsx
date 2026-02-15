import type { Metadata } from "next";
import { MembershipsSignupContent } from "./MembershipsSignupContent";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Join Wellness Program | Hello Gorgeous",
  description: "Sign up for Precision Hormone or Metabolic Reset membership.",
};

export default async function MembershipsSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const { program } = await searchParams;
  return (
    <div data-site="public">
      <MembershipsSignupContent programSlug={program || undefined} />
    </div>
  );
}
