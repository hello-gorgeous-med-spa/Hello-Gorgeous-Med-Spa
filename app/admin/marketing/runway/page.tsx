"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { GEN4_IMAGE_RATIOS, type Gen4ImageRatio } from "@/lib/runway-image";

const RATIO_LABELS: Record<Gen4ImageRatio, string> = {
  "1080:1080": "Square 1080",
  "1080:1920": "Story 1080×1920",
  "1920:1080": "Landscape 1920×1080",
  "1280:720": "Wide 1280×720",
  "720:1280": "Vertical 720×1280",
};

export default function RunwayMarketingStillPage() {
  const [promptText, setPromptText] = useState(
    "Bright modern med spa treatment room in Oswego, soft daylight, blush and black interior, empty styling chair, no people, no text",
  );
  const [ratio, setRatio] = useState<Gen4ImageRatio>("1080:1080");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOutputUrl(null);
    try {
      const response = await fetch("/api/runway/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText, ratio }),
      });
      const data = (await response.json()) as { output?: string[]; error?: string };
      if (!response.ok) {
        setError(data.error || "Generation failed.");
        return;
      }
      const url = data.output?.[0];
      if (!url) {
        setError("Runway finished without an image URL.");
        return;
      }
      setOutputUrl(url);
    } catch {
      setError("Could not reach the generator.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/marketing" className="text-sm text-black underline">
          Marketing
        </Link>
        <h1 className="text-2xl font-bold text-black mt-2">Marketing stills</h1>
        <p className="text-black mt-1">
          Gen-4 Image from a text prompt. Use this for spa lifestyle and campaign stills. Leave
          patient photos out, and do not promise treatment results. Save the image — the link
          expires.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border-2 border-black bg-white p-4">
        <label className="block text-sm font-medium text-black">
          Prompt
          <textarea
            value={promptText}
            onChange={(event) => setPromptText(event.target.value)}
            maxLength={1000}
            rows={5}
            required
            className="mt-1 w-full rounded-lg border border-black px-3 py-2 text-black"
          />
        </label>
        <p className="text-xs text-black/70">{promptText.length}/1000</p>

        <label className="block text-sm font-medium text-black">
          Size
          <select
            value={ratio}
            onChange={(event) => setRatio(event.target.value as Gen4ImageRatio)}
            className="mt-1 w-full rounded-lg border border-black px-3 py-2 text-black bg-white"
          >
            {GEN4_IMAGE_RATIOS.map((value) => (
              <option key={value} value={value}>
                {RATIO_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading || !promptText.trim()}
          className="px-4 py-2 rounded-lg bg-[#E6007E] text-white font-medium disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate still"}
        </button>
        {loading ? (
          <p className="text-sm text-black">This usually takes under a minute. Stay on this page.</p>
        ) : null}
      </form>

      {error ? (
        <p className="rounded-lg border border-black bg-white px-3 py-2 text-sm text-black" role="alert">
          {error}
        </p>
      ) : null}

      {outputUrl ? (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outputUrl} alt="Generated marketing still" className="w-full rounded-xl border-2 border-black" />
          <a href={outputUrl} target="_blank" rel="noreferrer" className="inline-block text-sm font-medium text-black underline">
            Open image
          </a>
        </div>
      ) : null}
    </div>
  );
}
