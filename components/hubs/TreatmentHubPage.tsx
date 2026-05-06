import Link from "next/link";
import type { TreatmentHubData } from "@/lib/treatment-hubs";
import { breadcrumbJsonLd, faqJsonLd, siteJsonLd, SITE } from "@/lib/seo";
import { VideoEmbed } from "@/components/video/VideoEmbed";
import { RelatedContentModule } from "@/components/recommendations/RelatedContentModule";

export function TreatmentHubPage({ hub }: { hub: TreatmentHubData }) {
  const url = `${SITE.url}/${hub.slug}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: hub.title, url },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(hub.faqs, url)) }} />

      <main className="bg-white">
        <section className="border-b-4 border-black bg-gradient-to-br from-black via-[#170b12] to-[#2d1020] py-16 text-white md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FFB8DC]">Treatment Hub</p>
            <h1 className="mt-3 text-4xl font-black md:text-6xl">{hub.title}</h1>
            <p className="mt-4 max-w-3xl text-white/85">{hub.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={hub.serviceUrl} className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">
                Explore service page
              </Link>
              <Link href="/book" className="rounded-lg border-2 border-white px-6 py-3 font-semibold text-white">
                Book consultation
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-black py-14 md:py-16">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-2">
            <article className="rounded-2xl border-2 border-black bg-white p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Recovery</h2>
              <p className="mt-2 text-black/80">{hub.recovery}</p>
            </article>
            <article className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Downtime</h2>
              <p className="mt-2 text-black/80">{hub.downtime}</p>
            </article>
            <article className="rounded-2xl border-2 border-black bg-white p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Pricing + Value</h2>
              <p className="mt-2 text-black/80">{hub.pricingValue}</p>
            </article>
            <article className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Local intent</h2>
              <p className="mt-2 text-black/80">{hub.localIntent}</p>
            </article>
          </div>
        </section>

        <section className="border-b-2 border-black bg-zinc-50 py-14 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-black text-black">Treatment Areas + Before/After Education</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border-2 border-black bg-white p-5">
                <h3 className="text-lg font-bold text-[#E6007E]">Treatment areas</h3>
                <ul className="mt-2 space-y-1 text-black/80">
                  {hub.treatmentAreas.map((area) => (
                    <li key={area}>- {area}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border-2 border-black bg-white p-5">
                <h3 className="text-lg font-bold text-[#E6007E]">Before/after education</h3>
                <p className="mt-2 text-black/80">{hub.beforeAfterEducation}</p>
              </article>
              <article className="rounded-2xl border-2 border-black bg-white p-5 md:col-span-2">
                <h3 className="text-lg font-bold text-[#E6007E]">Provider commentary</h3>
                <p className="mt-2 text-black/80">{hub.providerCommentary}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-black py-14 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-black text-black">Videos + Transcript Excerpts</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {hub.videos.map((video) => (
                <article key={video.title} className="rounded-2xl border-2 border-black bg-white p-5">
                  <h3 className="text-lg font-bold text-[#E6007E]">{video.title}</h3>
                  <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-black/10 bg-black">
                    <VideoEmbed embedUrl={video.embedUrl} title={video.title} />
                  </div>
                  <p className="mt-3 text-black/80">{video.transcriptExcerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b-2 border-black bg-zinc-50 py-14 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-black text-black">Comparisons + Related Treatments</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border-2 border-black bg-white p-5">
                <h3 className="text-lg font-bold text-[#E6007E]">Comparisons</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hub.comparisons.map((item) => (
                    <Link key={item.href} href={item.href} className="rounded-full border border-black/20 px-3 py-1 text-sm font-medium text-[#E6007E]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border-2 border-black bg-white p-5">
                <h3 className="text-lg font-bold text-[#E6007E]">Related treatments</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hub.relatedTreatments.map((item) => (
                    <Link key={item.href} href={item.href} className="rounded-full border border-black/20 px-3 py-1 text-sm font-medium text-[#E6007E]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </article>
            </div>
            <div className="mt-7">
              <Link href="/book" className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">
                Book consultation
              </Link>
            </div>
            <div className="mt-6">
              <RelatedContentModule
                seedTags={[hub.slug, ...hub.relatedTreatments.map((item) => item.label.toLowerCase())]}
                title={`People viewing ${hub.title} also read`}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
