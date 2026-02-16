"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Concern = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string;
  suggested_service_slugs: string[];
  status: string;
  created_at: string;
  owner_notes: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewed: "Reviewed",
  contacted: "Contacted",
  booked: "Booked",
};

export default function AdminConcernsPage() {
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Concern | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/concerns")
      .then((res) => res.json())
      .then((data) => {
        setConcerns(data.concerns || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selected) {
      setNotes(selected.owner_notes || "");
      setStatus(selected.status || "new");
    }
  }, [selected]);

  async function saveFollowUp() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/concerns/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner_notes: notes, status }),
      });
      if (res.ok) {
        setConcerns((prev) =>
          prev.map((c) =>
            c.id === selected.id ? { ...c, owner_notes: notes, status } : c
          )
        );
        setSelected((prev) => prev ? { ...prev, owner_notes: notes, status } : null);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-black">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">Fix What Bothers Me</h1>
          <p className="text-black text-sm mt-1">
            Client concerns from the website. Review, add notes, and send booking links.
          </p>
        </div>
        <a
          href="/fix-what-bothers-me"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600"
        >
          View form →
        </a>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {concerns.length === 0 ? (
            <div className="rounded-xl border border-black bg-white p-8 text-center text-black">
              No submissions yet. Share the link with clients:{" "}
              <strong className="text-black">/fix-what-bothers-me</strong>
            </div>
          ) : (
            concerns.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c)}
                className={`w-full text-left rounded-xl border p-4 transition-colors ${
                  selected?.id === c.id
                    ? "border-pink-500 bg-pink-50"
                    : "border-black bg-white hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-black font-medium line-clamp-1">
                    {c.name || c.email || "Anonymous"}
                  </p>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.status === "new"
                        ? "bg-amber-100 text-amber-800"
                        : c.status === "booked"
                          ? "bg-green-100 text-green-800"
                          : "bg-white text-black"
                    }`}
                  >
                    {STATUS_LABELS[c.status] || c.status}
                  </span>
                </div>
                <p className="text-sm text-black mt-1 line-clamp-2">{c.message}</p>
                <p className="text-xs text-black mt-2">
                  {new Date(c.created_at).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>

        {selected && (
          <div className="rounded-xl border border-black bg-white p-6 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-black">Details</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-black hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {(selected.name || selected.email || selected.phone) && (
                <div className="text-sm">
                  {selected.name && <p><span className="text-black">Name:</span> {selected.name}</p>}
                  {selected.email && (
                    <p>
                      <span className="text-black">Email:</span>{" "}
                      <a href={`mailto:${selected.email}`} className="text-pink-600 hover:underline">
                        {selected.email}
                      </a>
                    </p>
                  )}
                  {selected.phone && (
                    <p>
                      <span className="text-black">Phone:</span>{" "}
                      <a href={`tel:${selected.phone}`} className="text-pink-600 hover:underline">
                        {selected.phone}
                      </a>
                    </p>
                  )}
                </div>
              )}
              <div>
                <p className="text-black text-sm font-medium mb-1">What they shared</p>
                <p className="text-black whitespace-pre-wrap rounded-lg bg-white p-3 text-sm">
                  {selected.message}
                </p>
              </div>
              {selected.suggested_service_slugs?.length > 0 && (
                <div>
                  <p className="text-black text-sm font-medium mb-2">Suggested services</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.suggested_service_slugs.map((slug) => (
                      <Link
                        key={slug}
                        href={`/book/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-pink-100 text-pink-800 text-sm font-medium rounded-lg hover:bg-pink-200"
                      >
                        {slug.replace(/-/g, " ")} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-black text-sm font-medium mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-black px-3 py-2 text-sm"
                >
                  {Object.entries(STATUS_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-black text-sm font-medium mb-1">Your notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Follow-up notes…"
                  className="w-full rounded-lg border border-black px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={saveFollowUp}
                disabled={saving}
                className="w-full py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save notes & status"}
              </button>
              {selected.email && (
                <a
                  href={`mailto:${selected.email}?subject=Hello Gorgeous – we have options for you&body=Hi${selected.name ? ` ${selected.name}` : ""},%0A%0AThank you for sharing what's on your mind. We'd love to match you with a treatment that fits.%0A%0ABook a time that works: ${typeof window !== "undefined" ? window.location.origin : ""}/book%0A%0AOr reply to this email and we'll help you choose.%0A%0A— Hello Gorgeous Med Spa`}
                  className="block w-full py-2 border border-pink-500 text-pink-600 text-sm font-medium rounded-lg text-center hover:bg-pink-50"
                >
                  Email them a booking link
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
