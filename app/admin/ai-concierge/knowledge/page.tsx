"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";

type Row = {
  id: string;
  category: string;
  question: string;
  answer: string;
  enabled: boolean;
};

export default function AiConciergeKnowledgePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    category: "services",
    question: "",
    answer: "",
    enabled: true,
  });

  async function load() {
    setErr(null);
    const { data, error } = await supabase.from("ai_concierge_knowledge").select("*").order("category");
    if (error) setErr(error.message);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.question.trim() || !draft.answer.trim()) return;
    const { error } = await supabase.from("ai_concierge_knowledge").insert({
      category: draft.category.trim(),
      question: draft.question.trim(),
      answer: draft.answer.trim(),
      enabled: draft.enabled,
    });
    if (error) {
      alert(error.message);
      return;
    }
    setDraft({ category: "services", question: "", answer: "", enabled: true });
    await load();
  }

  async function toggle(id: string, enabled: boolean) {
    const { error } = await supabase.from("ai_concierge_knowledge").update({ enabled }).eq("id", id);
    if (error) alert(error.message);
    else await load();
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Knowledge base</h2>
      {loading && <p className="text-sm">Loading…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      <form onSubmit={add} className="mb-6 p-4 border border-black/10 rounded-lg space-y-2 max-w-xl">
        <h3 className="font-medium">Add FAQ</h3>
        <input
          className="w-full border border-black/15 rounded px-2 py-1 text-sm"
          placeholder="Category (e.g. services)"
          value={draft.category}
          onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
        />
        <input
          className="w-full border border-black/15 rounded px-2 py-1 text-sm"
          placeholder="Question"
          value={draft.question}
          onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
        />
        <textarea
          className="w-full border border-black/15 rounded px-2 py-1 text-sm min-h-[80px]"
          placeholder="Answer"
          value={draft.answer}
          onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={draft.enabled} onChange={(e) => setDraft((d) => ({ ...d, enabled: e.target.checked }))} />
          Enabled
        </label>
        <button type="submit" className="px-3 py-1.5 rounded bg-[#E6007E] text-white text-sm">
          Save FAQ
        </button>
      </form>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="border border-black/10 rounded-lg p-3">
            <div className="flex justify-between gap-2">
              <span className="text-xs uppercase text-black/50">{r.category}</span>
              <button type="button" className="text-xs underline" onClick={() => toggle(r.id, !r.enabled)}>
                {r.enabled ? "Disable" : "Enable"}
              </button>
            </div>
            <p className="font-medium mt-1">{r.question}</p>
            <p className="text-sm text-black/80 mt-1 whitespace-pre-wrap">{r.answer}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
