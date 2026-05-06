import { CONTENT_COLLECTIONS, CONTENT_TYPE_LABELS } from "@/lib/content-os";

export default function ContentOsAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black text-black">Content Operating System</h1>
      <p className="mt-2 max-w-3xl text-black/70">
        Structured publishing workflow for provider insights, treatment updates, FAQ additions, case studies, transcript updates, and comparison refreshes.
      </p>

      <section className="mt-6 rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
        <h2 className="text-xl font-bold text-black">Publishing workflow (no-code cadence)</h2>
        <ol className="mt-3 space-y-2 text-black/80">
          <li>1. Draft content entry with type + tags + related treatment links.</li>
          <li>2. Move status from draft to review after clinical/legal check.</li>
          <li>3. Publish and stamp `publishedAt` + `updatedAt` for freshness signals.</li>
          <li>4. Sync llms/ai-profile graph when new authority assets ship.</li>
        </ol>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border-2 border-black">
        <table className="w-full border-collapse bg-white text-left text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Related Treatments</th>
            </tr>
          </thead>
          <tbody>
            {CONTENT_COLLECTIONS.map((item) => (
              <tr key={item.id} className="border-t border-black/10">
                <td className="px-4 py-3 font-semibold text-[#E6007E]">{item.title}</td>
                <td className="px-4 py-3">{CONTENT_TYPE_LABELS[item.type]}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.updatedAt.slice(0, 10)}</td>
                <td className="px-4 py-3">{item.relatedTreatments.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
