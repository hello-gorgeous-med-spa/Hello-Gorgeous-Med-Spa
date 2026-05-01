"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface InspectionRow {
  url: string;
  verdict?: string;
  coverage?: string;
  lastCrawl?: string;
  error?: string;
}

interface SitemapStatus {
  path?: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  errors?: number;
  warnings?: number;
  contents?: Array<{ type?: string; submitted?: string; indexed?: string }>;
}

interface SubmitReport {
  ok: boolean;
  property?: string;
  sitemap?: string;
  submitted?: boolean;
  status?: SitemapStatus;
  inspections?: InspectionRow[];
  error?: string;
  hint?: string;
}

export default function GoogleSearchConsoleAdminPage() {
  const [report, setReport] = useState<SubmitReport | null>(null);
  const [busy, setBusy] = useState<"idle" | "loading" | "submitting">("idle");

  async function load() {
    setBusy("loading");
    try {
      const res = await fetch("/api/seo/sitemap-submit", { cache: "no-store" });
      setReport((await res.json()) as SubmitReport);
    } catch (e) {
      setReport({ ok: false, error: e instanceof Error ? e.message : "Network error" });
    } finally {
      setBusy("idle");
    }
  }

  async function resubmit() {
    setBusy("submitting");
    try {
      const res = await fetch("/api/seo/sitemap-submit", { method: "POST" });
      setReport((await res.json()) as SubmitReport);
    } catch (e) {
      setReport({ ok: false, error: e instanceof Error ? e.message : "Network error" });
    } finally {
      setBusy("idle");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto text-black">
      <div className="flex items-center gap-3 mb-4 text-sm">
        <Link href="/admin/seo" className="hover:underline">
          ← SEO
        </Link>
        <span className="text-black/40">/</span>
        <span className="font-semibold">Google Search Console</span>
      </div>

      <h1 className="text-2xl font-black mb-1">Google Search Console</h1>
      <p className="text-sm text-black/70 mb-6">
        Submit the sitemap, watch crawl status, and check whether the premium
        landing pages are indexed — directly from the API. No more clicking
        around in the GSC web UI.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => void resubmit()}
          disabled={busy !== "idle"}
          className="px-4 py-2 rounded bg-[#E6007E] text-white text-sm font-bold disabled:opacity-50 hover:bg-[#c00069]"
        >
          {busy === "submitting" ? "Submitting…" : "Submit sitemap now"}
        </button>
        <button
          type="button"
          onClick={() => void load()}
          disabled={busy !== "idle"}
          className="px-4 py-2 rounded border-2 border-black text-sm font-bold disabled:opacity-50 hover:bg-black/5"
        >
          {busy === "loading" ? "Loading…" : "Refresh status"}
        </button>
        <a
          href="/api/seo/google-connect"
          className="text-xs text-black/60 hover:text-[#E6007E] underline"
        >
          Re-authorize OAuth
        </a>
      </div>

      {report?.error && (
        <div className="border border-red-200 bg-red-50 text-red-800 rounded p-3 text-sm mb-4">
          <p className="font-semibold mb-1">Error: {report.error}</p>
          {report.hint && <p className="text-red-700/80">Hint: {report.hint}</p>}
        </div>
      )}

      {report?.ok && (
        <>
          <section className="border-2 border-black rounded-lg p-4 bg-white mb-4">
            <p className="text-[11px] uppercase tracking-wider text-black/60 mb-1">Property</p>
            <p className="font-mono text-sm break-all">{report.property}</p>
            <p className="text-[11px] uppercase tracking-wider text-black/60 mt-3 mb-1">Sitemap</p>
            <p className="font-mono text-sm break-all">{report.sitemap}</p>
            {report.submitted && (
              <p className="mt-3 inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-bold">
                ✓ Submitted to Google
              </p>
            )}
          </section>

          {report.status && (
            <section className="border-2 border-black rounded-lg p-4 bg-white mb-4">
              <h2 className="text-sm font-semibold mb-3">Crawl & index status</h2>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <Datum label="Last submitted" value={report.status.lastSubmitted} />
                <Datum label="Last downloaded" value={report.status.lastDownloaded} />
                <Datum
                  label="Pending"
                  value={report.status.isPending ? "Yes" : "No"}
                />
                <Datum
                  label="Errors / warnings"
                  value={`${report.status.errors ?? 0} / ${report.status.warnings ?? 0}`}
                />
              </dl>
              {report.status.contents && report.status.contents.length > 0 && (
                <table className="w-full text-xs mt-4">
                  <thead className="bg-black/5">
                    <tr>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Submitted</th>
                      <th className="text-left p-2">Indexed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.status.contents.map((c, i) => (
                      <tr key={i} className="border-t border-black/5">
                        <td className="p-2 font-mono">{c.type ?? "—"}</td>
                        <td className="p-2">{c.submitted ?? "—"}</td>
                        <td className="p-2">{c.indexed ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {report.inspections && report.inspections.length > 0 && (
            <section className="border-2 border-black rounded-lg p-4 bg-white">
              <h2 className="text-sm font-semibold mb-3">Premium landing pages — index status</h2>
              <table className="w-full text-xs">
                <thead className="bg-black/5">
                  <tr>
                    <th className="text-left p-2">URL</th>
                    <th className="text-left p-2">Verdict</th>
                    <th className="text-left p-2">Coverage</th>
                    <th className="text-left p-2">Last crawl</th>
                  </tr>
                </thead>
                <tbody>
                  {report.inspections.map((row, i) => (
                    <tr key={i} className="border-t border-black/5">
                      <td className="p-2 font-mono break-all">{row.url}</td>
                      <td className="p-2">
                        {row.error ? (
                          <span className="text-red-700">{row.error}</span>
                        ) : (
                          <Verdict v={row.verdict} />
                        )}
                      </td>
                      <td className="p-2">{row.coverage ?? "—"}</td>
                      <td className="p-2">
                        {row.lastCrawl ? new Date(row.lastCrawl).toLocaleString() : "never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-black/50 mt-3">
                Tip: the Search Console API <em>cannot</em> trigger indexing for
                regular pages. To speed up indexing of a specific URL, paste it
                into the Search Console URL Inspection bar in the web UI and
                click &quot;Request Indexing&quot;. The sitemap submission above
                IS the bulk discovery signal Google uses.
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function Datum({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-black/60">{label}</dt>
      <dd className="font-mono">{value ?? "—"}</dd>
    </div>
  );
}

function Verdict({ v }: { v?: string }) {
  if (!v) return <span className="text-black/40">unknown</span>;
  const tone =
    v === "PASS"
      ? "bg-green-100 text-green-800"
      : v === "PARTIAL"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800";
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tone}`}>{v}</span>
  );
}
