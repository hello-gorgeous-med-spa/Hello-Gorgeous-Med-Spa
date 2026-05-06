"use client";

import Link from "next/link";
import { useState } from "react";

type ResultItem = {
  id: string;
  type: string;
  title: string;
  summary: string;
  href: string;
};

export function SemanticSearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [related, setRelated] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/public/search?q=${encodeURIComponent(query.trim())}`);
    const payload = await res.json();
    setResults(payload.results ?? []);
    setRelated(payload.related ?? []);
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={runSearch} className="grid gap-3 rounded-2xl border-2 border-black bg-white p-4 md:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services, concerns, videos, comparisons, FAQs..."
          className="rounded-lg border border-black/20 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-[#E6007E] px-5 py-2 text-sm font-semibold text-white">
          Search
        </button>
      </form>

      {loading ? <p className="mt-4 text-sm text-black/60">Searching...</p> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold text-black">Results</h2>
          <div className="mt-3 space-y-3">
            {results.map((item) => (
              <article key={item.id} className="rounded-xl border border-black/15 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#E6007E]">{item.type}</p>
                <Link href={item.href} className="mt-1 block text-lg font-bold text-black hover:text-[#E6007E]">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-black/75">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">Related content suggestions</h2>
          <div className="mt-3 space-y-3">
            {related.map((item) => (
              <article key={item.id} className="rounded-xl border border-black/15 bg-[#FFF0F7] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#E6007E]">{item.type}</p>
                <Link href={item.href} className="mt-1 block text-lg font-bold text-black hover:text-[#E6007E]">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-black/75">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
