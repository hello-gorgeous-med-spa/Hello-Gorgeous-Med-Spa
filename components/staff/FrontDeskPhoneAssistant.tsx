"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  FRONT_DESK_ASSISTANT_TOPICS,
  type FrontDeskAssistantHit,
} from "@/lib/front-desk-phone-assistant";
import { SITE } from "@/lib/seo";

const SOURCE_LABEL: Record<FrontDeskAssistantHit["source"], string> = {
  spa: "Med spa script",
  "rx-qa": "RX desk Q&A",
  faq: "FAQ",
  service: "Service menu",
  knowledge: "Clinical KB",
  "quick-fact": "Quick fact",
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

function HitCard({ hit }: { hit: FrontDeskAssistantHit }) {
  return (
    <article className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-lg border border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {SOURCE_LABEL[hit.source]}
        </span>
        <span className="text-xs font-medium text-black/50">{hit.category}</span>
        {hit.escalate ? (
          <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
            Escalate to provider
          </span>
        ) : null}
      </div>

      <h3 className="text-base font-bold text-[#E6007E]">{hit.question}</h3>
      <p className="mt-2 text-sm font-medium leading-relaxed text-black/85">{hit.answer}</p>

      {hit.say ? (
        <div className="mt-3 rounded-xl border-2 border-[#E6007E]/30 bg-rose-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">Say this</p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-black">{hit.say}</p>
          <div className="mt-2">
            <CopyButton text={hit.say.replace(/^["“]|["”]$/g, "")} label="Copy script" />
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <CopyButton text={hit.answer} label="Copy answer" />
        </div>
      )}

      {hit.href ? (
        <a
          href={hit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs font-semibold text-[#E6007E] underline decoration-[#FF2D8E]"
        >
          Open on site →
        </a>
      ) : null}
    </article>
  );
}

export default function FrontDeskPhoneAssistant() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<FrontDeskAssistantHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [escalate, setEscalate] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setHits([]);
      setSearched(false);
      setEscalate(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/staff/front-desk-assistant?q=${encodeURIComponent(trimmed)}`);
      const data = (await res.json()) as {
        hits?: FrontDeskAssistantHit[];
        escalate?: boolean;
      };
      setHits(data.hits ?? []);
      setEscalate(Boolean(data.escalate));
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim().length >= 2) runSearch(query);
    }, 280);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#2d1020] to-black text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(230,0,126,0.15),transparent_50%)]" />

      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <Link href="/staff" className="text-sm font-medium text-pink-300 hover:text-white">
            ← Staff hub
          </Link>
          <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="text-sm font-bold text-[#FFB8DC]">
            {SITE.phone}
          </a>
        </div>
        <div className="mx-auto mt-4 max-w-lg text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">On a call?</p>
          <h1 className="mt-1 text-2xl font-black">Front Desk Assistant</h1>
          <p className="mt-1 text-sm text-white/70">Type what they&apos;re asking — get the answer + script</p>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            placeholder='e.g. "how much is botox" or "peptide shipping"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border-2 border-black bg-white px-4 py-4 pr-12 text-base font-medium text-black shadow-[4px_4px_0_0_rgba(230,0,126,0.5)] placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#E6007E]"
          />
          {loading ? (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-black/40">…</span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {FRONT_DESK_ASSISTANT_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => {
                setQuery(topic.query);
                inputRef.current?.focus();
              }}
              className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:border-[#E6007E] hover:bg-[#E6007E]/20"
            >
              {topic.icon} {topic.label}
            </button>
          ))}
        </div>

        {escalate ? (
          <div className="mt-4 rounded-xl border-2 border-amber-400/60 bg-amber-500/15 p-3 text-sm text-amber-100">
            <strong>Safety flag:</strong> This question may need Ryan or clinical staff — do not diagnose on the phone.
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {!searched && !query.trim() ? (
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-center text-sm text-white/70">
              <p className="font-semibold text-white">Try asking like a caller would:</p>
              <p className="mt-2">&ldquo;Can you tell me about Morpheus8?&rdquo;</p>
              <p>&ldquo;How do I order peptides?&rdquo;</p>
              <p>&ldquo;What&apos;s lip filler cost?&rdquo;</p>
            </div>
          ) : null}

          {searched && !loading && hits.length === 0 ? (
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-center text-sm text-white/80">
              No exact match — try a shorter keyword (botox, GLP-1, book, hours) or transfer to Dani/Ryan.
            </div>
          ) : null}

          {hits.map((hit) => (
            <HitCard key={hit.id} hit={hit} />
          ))}
        </div>

        <p className="mt-8 pb-10 text-center text-xs text-white/40">
          Answers pull from live pricing libs, FAQs, RX desk scripts &amp; clinical KB. Not medical advice.
        </p>
      </div>
    </div>
  );
}
