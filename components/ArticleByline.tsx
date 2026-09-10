import Link from "next/link";
import { DANI_FULL_NAME } from "@/lib/founder-credentials";
import { MEDICAL_DIRECTOR } from "@/lib/medical-authority";

export function ArticleByline({
  lastReviewed,
  showMedicalReviewer = true,
}: {
  lastReviewed: string;
  showMedicalReviewer?: boolean;
}) {
  const reviewedLabel = new Date(lastReviewed).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <aside
      className="mb-8 rounded-2xl border-2 border-black/10 bg-[#FFF0F7]/60 px-5 py-4 text-sm"
      aria-label="Article author and medical reviewer"
    >
      <p className="font-bold text-black">
        By{" "}
        <Link href="/about#dani" className="text-[#E6007E] hover:underline">
          {DANI_FULL_NAME}
        </Link>
      </p>
      <p className="mt-1 text-black/75">
        Licensed Esthetician, Phlebotomist, CMAA · Owner, Hello Gorgeous Med Spa
      </p>
      {showMedicalReviewer ? (
        <p className="mt-3 text-black/80">
          Medically reviewed under{" "}
          <Link href={MEDICAL_DIRECTOR.profilePath} className="font-semibold text-[#E6007E] hover:underline">
            {MEDICAL_DIRECTOR.displayName}
          </Link>
        </p>
      ) : null}
      <p className="mt-2 text-black/60 text-xs">Last updated {reviewedLabel}</p>
    </aside>
  );
}
