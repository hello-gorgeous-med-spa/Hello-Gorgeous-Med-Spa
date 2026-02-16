"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type MascotFeedbackItem = {
  id: string;
  message: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  source: string;
  read_at: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function MascotFeedbackPage() {
  const [items, setItems] = useState<MascotFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mascot/feedback")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/ai" className="text-black hover:text-black text-sm">← AI Hub</Link>
        <h1 className="text-2xl font-bold text-black mt-2">Mascot feedback for owner</h1>
        <p className="text-black text-sm mt-1">
          Messages, complaints, and callback requests sent from the Hello Gorgeous chat widget. She sends you everything so you can follow up.
        </p>
      </div>

      {loading ? (
        <p className="text-black">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-black bg-white p-8 text-center text-black">
          No feedback yet. When visitors use “Send to owner” in the chat, it will show up here (and in your email if Resend is configured).
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-black bg-white p-4 shadow-sm"
            >
              <p className="text-black whitespace-pre-wrap">{item.message}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-black">
                {item.contact_name && <span>Name: {item.contact_name}</span>}
                {item.contact_email && <a href={`mailto:${item.contact_email}`} className="text-pink-600 hover:underline">{item.contact_email}</a>}
                {item.contact_phone && <a href={`tel:${item.contact_phone}`} className="text-pink-600 hover:underline">{item.contact_phone}</a>}
                <span>{formatDate(item.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
