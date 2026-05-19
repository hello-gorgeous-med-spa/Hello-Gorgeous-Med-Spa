import Image from "next/image";
import { credentialStripForSlug, DANI_IMAGE, RYAN_IMAGE } from "@/lib/founder-credentials";

export function CredentialStrip({ slug }: { slug: string }) {
  const copy = credentialStripForSlug(slug);
  const paragraphs = copy.split("\n\n").filter(Boolean);

  return (
    <section
      className="border-y-4 border-black bg-gradient-to-r from-[#FFF0F7] via-white to-[#FFF0F7]"
      aria-label="Clinical team credentials"
    >
      <div className="max-w-4xl mx-auto px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
          <div className="flex shrink-0 -space-x-2" aria-hidden>
            <Image
              src={DANI_IMAGE}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-black object-cover"
            />
            <Image
              src={RYAN_IMAGE}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-black object-cover"
            />
          </div>
          <div className="space-y-3 text-sm md:text-base text-black/85 font-medium leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
