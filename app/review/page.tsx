import { redirect } from "next/navigation";
import { GOOGLE_REVIEW_URL } from "@/lib/local-seo";

export const metadata = {
  title: "Leave a Review | Hello Gorgeous Med Spa",
  description: "Share your experience at Hello Gorgeous Med Spa. Your review helps others find us.",
  robots: "noindex, follow",
};

export default function ReviewPage() {
  redirect(GOOGLE_REVIEW_URL);
}
