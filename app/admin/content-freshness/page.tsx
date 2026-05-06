import { CONTENT_FRESHNESS_ASSETS } from "@/lib/content-freshness";

export default function ContentFreshnessAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black text-black">Content Freshness Workflow</h1>
      <p className="mt-2 max-w-3xl text-black/70">
        Admin workflow for continuously updating FAQs, comparisons, provider commentary, videos/transcripts, and local-intent sections so search and AI systems keep seeing fresh authority signals.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border-2 border-black">
        <table className="w-full border-collapse bg-white text-left text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3">Cadence</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {CONTENT_FRESHNESS_ASSETS.map((asset) => (
              <tr key={asset.id} className="border-t border-black/10">
                <td className="px-4 py-3 font-semibold text-[#E6007E]">{asset.name}</td>
                <td className="px-4 py-3">{asset.updateCadence}</td>
                <td className="px-4 py-3">{asset.owner}</td>
                <td className="px-4 py-3 font-mono text-xs">{asset.sourcePath}</td>
                <td className="px-4 py-3">{asset.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-6 rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
        <h2 className="text-xl font-bold text-black">Operational checklist</h2>
        <ul className="mt-3 space-y-2 text-black/80">
          <li>- Add at least one FAQ update or clarification per priority service weekly.</li>
          <li>- Publish one new transcripted video clip weekly with concern + service tags.</li>
          <li>- Review approved testimonials and promote records from placeholder to approved state.</li>
          <li>- Refresh one comparison or concern page every week to maintain authority freshness.</li>
          <li>- Sync `llms` and `ai-profile` whenever new hub/concern/video/funnel assets are added.</li>
        </ul>
      </section>
    </main>
  );
}
