import Link from "next/link";

/** Contextual internal links in homepage body for local SEO authority. */
export function HomepageGeoLinks() {
  return (
    <section className="py-6 md:py-8 px-4 md:px-6 bg-[#FDF7FA]">
      <div className="max-w-3xl mx-auto text-center min-w-0">
        <p className="text-[#5E5E66] text-base md:text-lg leading-relaxed">
          Hello Gorgeous Med Spa in Oswego serves clients from Naperville, Aurora, and Plainfield.
          Popular services include{" "}
          <Link href="/botox-oswego-il" className="text-[#E6007E] hover:text-[#B0005F] font-medium underline underline-offset-2">
            Botox in Oswego
          </Link>
          ,{" "}
          <Link href="/weight-loss-oswego-il" className="text-[#E6007E] hover:text-[#B0005F] font-medium underline underline-offset-2">
            Weight Loss Injections in Oswego
          </Link>
          ,{" "}
          <Link href="/prf-hair-restoration-oswego-il" className="text-[#E6007E] hover:text-[#B0005F] font-medium underline underline-offset-2">
            PRF Hair Restoration
          </Link>
          , and{" "}
          <Link href="/hormone-therapy-oswego-il" className="text-[#E6007E] hover:text-[#B0005F] font-medium underline underline-offset-2">
            Hormone Therapy in Oswego
          </Link>
          . Book a consultation to find your perfect plan.
        </p>
      </div>
    </section>
  );
}
