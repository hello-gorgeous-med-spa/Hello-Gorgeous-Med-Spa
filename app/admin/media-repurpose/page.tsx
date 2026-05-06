import { buildRepurposePack } from "@/lib/media-repurpose";
import { VIDEO_LIBRARY } from "@/lib/video-library";

export default function MediaRepurposeAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black text-black">Media Repurposing Engine</h1>
      <p className="mt-2 max-w-3xl text-black/70">
        Convert one source asset into transcript snippets, quote cards, FAQ candidates, clip references, social captions, and internal-link suggestions.
      </p>

      <div className="mt-6 space-y-4">
        {VIDEO_LIBRARY.map((video) => {
          const pack = buildRepurposePack(video);
          return (
            <article key={video.id} className="rounded-2xl border-2 border-black bg-white p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">{video.title}</h2>
              <p className="mt-2 text-sm text-black/75">{video.summary}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <section>
                  <h3 className="font-semibold text-black">Quote extraction</h3>
                  <ul className="mt-2 space-y-1 text-sm text-black/80">
                    {pack.quotes.map((quote) => (
                      <li key={quote}>{quote}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-semibold text-black">FAQ candidates</h3>
                  <ul className="mt-2 space-y-1 text-sm text-black/80">
                    {pack.faqCandidates.map((faq) => (
                      <li key={faq.question}>
                        {faq.question} - {faq.answer}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
