"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ClinicalCheatSheet,
  ClinicalCheatSheetCategory,
} from "@/lib/clinical-cheat-sheets";
import { CLINICAL_CHEAT_SHEET_CATEGORIES } from "@/lib/clinical-cheat-sheets";
import type { RegenProtocolGuide, RegenStaffSocialPost } from "@/lib/regen-staff-protocols";
import { rxInvoiceQuickLink } from "@/lib/regen-staff-protocols";
import { BESTIE_SQUARE_DISCOUNT } from "@/lib/square/bestie-discount";
import type { RxInvoiceTemplate } from "@/lib/rx-invoice-templates";
import { formatUsd } from "@/lib/rx-invoice-templates";

type Tab = "guides" | "cheat-sheets" | "social" | "invoices";

const VALID_TABS: Tab[] = ["guides", "cheat-sheets", "social", "invoices"];

function tabFromParam(value: string | null): Tab {
  if (value && VALID_TABS.includes(value as Tab)) return value as Tab;
  return "guides";
}

type Props = {
  coreGuides: RegenProtocolGuide[];
  peptideGuides: RegenProtocolGuide[];
  cheatSheets: ClinicalCheatSheet[];
  socialJuly: RegenStaffSocialPost[];
  socialWeek1: RegenStaffSocialPost[];
  invoiceQuickPicks: RxInvoiceTemplate[];
  allInvoices: RxInvoiceTemplate[];
  invoiceTracks: { id: string; label: string; count: number }[];
};

const TAB_LABELS: { id: Tab; label: string; icon: string }[] = [
  { id: "guides", label: "Guides", icon: "📋" },
  { id: "cheat-sheets", label: "Cheat Sheets", icon: "📑" },
  { id: "social", label: "Social", icon: "📱" },
  { id: "invoices", label: "Invoices", icon: "💳" },
];

function CopyButton({ text, label = "Copy caption" }: { text: string; label?: string }) {
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
      className="w-full rounded-xl border-2 border-pink-500/40 bg-pink-500/10 px-4 py-2.5 text-sm font-semibold text-pink-200 hover:border-pink-400 hover:bg-pink-500/20 transition-colors"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

function CheatSheetCard({ sheet }: { sheet: ClinicalCheatSheet }) {
  const cat = CLINICAL_CHEAT_SHEET_CATEGORIES.find((c) => c.id === sheet.category);
  return (
    <a
      href={sheet.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border-2 border-white/10 bg-white/5 overflow-hidden hover:border-amber-400/50 hover:bg-white/10 transition-all"
    >
      {sheet.thumbnail ? (
        <div className="relative h-32 w-full bg-black/50 border-b border-white/10">
          <Image
            src={sheet.thumbnail}
            alt={sheet.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 480px) 100vw, 400px"
          />
        </div>
      ) : null}
      <div className="flex items-start gap-3 p-4">
        <span className="text-2xl shrink-0">{cat?.icon ?? "📑"}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-white text-sm leading-snug">{sheet.title}</h3>
          <p className="text-amber-200/60 text-xs mt-1">{sheet.description}</p>
          {cat ? (
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1.5">{cat.label}</p>
          ) : null}
        </div>
        <span className="text-amber-400 shrink-0 text-xs font-bold">PDF</span>
      </div>
    </a>
  );
}

function GuideCard({ guide }: { guide: RegenProtocolGuide }) {
  return (
    <a
      href={guide.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border-2 border-white/10 bg-white/5 p-4 hover:border-pink-500/50 hover:bg-white/10 transition-all"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{guide.format === "html" ? "🌐" : "📄"}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-white text-sm leading-snug">{guide.title}</h3>
          <p className="text-pink-200/60 text-xs mt-1">{guide.description}</p>
        </div>
        <span className="text-pink-400 shrink-0">→</span>
      </div>
    </a>
  );
}

function SocialPostCard({ post }: { post: RegenStaffSocialPost }) {
  const img = post.staffImagePath ?? post.imagePath;

  return (
    <div className="rounded-2xl border-2 border-purple-500/30 bg-white/5 overflow-hidden">
      <div className="relative aspect-square w-full bg-black/40">
        <Image
          src={img}
          alt={post.label}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 400px"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
            {post.dayLabel}
          </span>
          <span className="text-xs text-gray-400">{post.channels.join(" · ")}</span>
        </div>
        <h3 className="font-bold text-white text-sm">{post.label}</h3>
        <p className="text-pink-100/80 text-xs whitespace-pre-line line-clamp-4">{post.message}</p>
        <div className="flex flex-col gap-2">
          <CopyButton text={post.message} />
          <a
            href={img}
            download
            className="text-center rounded-xl border-2 border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 hover:border-cyan-400 transition-colors"
          >
            Download image
          </a>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-xs text-pink-300 underline decoration-pink-500"
          >
            Post link: {post.link.replace("https://www.hellogorgeousmedspa.com", "")}
          </a>
        </div>
      </div>
    </div>
  );
}

function InvoiceRow({ template }: { template: RxInvoiceTemplate }) {
  return (
    <a
      href={rxInvoiceQuickLink(template.id)}
      className="flex items-center gap-3 rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 hover:border-emerald-400/50 hover:bg-white/10 transition-all"
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-white text-sm truncate">{template.name}</p>
        <p className="text-xs text-gray-400 truncate">{template.group}</p>
      </div>
      <span className="shrink-0 font-bold text-emerald-300">{formatUsd(template.amountUsd)}</span>
      <span className="text-emerald-400 shrink-0">→</span>
    </a>
  );
}

export default function RegenStaffProtocolsContent({
  coreGuides,
  peptideGuides,
  cheatSheets,
  socialJuly,
  socialWeek1,
  invoiceQuickPicks,
  allInvoices,
  invoiceTracks,
}: Props) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => tabFromParam(searchParams.get("tab")));
  const [socialPack, setSocialPack] = useState<"week1" | "july">("week1");
  const [invoiceTrack, setInvoiceTrack] = useState<string>("all");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [cheatCategory, setCheatCategory] = useState<ClinicalCheatSheetCategory | "all">("all");
  const [cheatSearch, setCheatSearch] = useState("");

  useEffect(() => {
    setTab(tabFromParam(searchParams.get("tab")));
  }, [searchParams]);

  const socialPosts = socialPack === "week1" ? socialWeek1 : socialJuly;

  const filteredCheatSheets = useMemo(() => {
    const q = cheatSearch.trim().toLowerCase();
    return cheatSheets.filter((s) => {
      if (cheatCategory !== "all" && s.category !== cheatCategory) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.filename.toLowerCase().includes(q)
      );
    });
  }, [cheatSheets, cheatCategory, cheatSearch]);

  const filteredInvoices = useMemo(() => {
    const q = invoiceSearch.trim().toLowerCase();
    return allInvoices.filter((t) => {
      if (invoiceTrack !== "all" && t.track !== invoiceTrack) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.group.toLowerCase().includes(q) ||
        t.lineLabel.toLowerCase().includes(q)
      );
    });
  }, [allInvoices, invoiceTrack, invoiceSearch]);

  const guidesByCategory = useMemo(() => {
    const cats: Record<string, RegenProtocolGuide[]> = {
      "Getting started": coreGuides.filter((g) => g.category === "getting-started" || g.category === "posters"),
      "Peptide dosing": peptideGuides,
    };
    return cats;
  }, [coreGuides, peptideGuides]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-black">
      <div className="max-w-lg mx-auto px-4 py-8 pb-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/staff"
            className="text-sm text-pink-300 hover:text-pink-200 inline-flex items-center gap-1"
          >
            ← Staff Hub
          </Link>
          <Link
            href="/admin/rx/ops"
            className="text-sm text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1"
          >
            RX Ops Console →
          </Link>
        </div>

        <div className="text-center mb-8">
          <img
            src="/images/regen/regen-logo.png"
            alt="RE GEN"
            className="h-16 mx-auto mb-4 rounded-lg"
          />
          <h1 className="text-2xl font-bold text-white mb-1">Protocols &amp; Quick Tools</h1>
          <p className="text-pink-300 text-sm">
            Guides · clinical cheat sheets · social · RX invoices
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 sm:grid-cols-4">
          {TAB_LABELS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl border-2 px-2 py-2.5 text-xs font-bold transition-all ${
                tab === t.id
                  ? "border-pink-500 bg-pink-500/20 text-white"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-pink-500/40"
              }`}
            >
              <span className="block text-lg mb-0.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <Link
          href="/admin/promos/bestie"
          className="mb-6 block rounded-2xl border-2 border-amber-400/50 bg-amber-500/10 p-4 hover:bg-amber-500/15 transition-colors"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Bestie program</p>
          <p className="mt-1 font-black text-white text-lg font-mono">{BESTIE_SQUARE_DISCOUNT.code}</p>
          <p className="text-sm text-amber-100/80 mt-0.5">
            ${BESTIE_SQUARE_DISCOUNT.amountUsd} off at Square POS → Discounts → search code
          </p>
        </Link>

        {tab === "guides" && (
          <div className="space-y-6">
            {Object.entries(guidesByCategory).map(([heading, guides]) => (
              <section key={heading}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-3">
                  {heading}
                </h2>
                <div className="space-y-2">
                  {guides.map((g) => (
                    <GuideCard key={g.id} guide={g} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {tab === "cheat-sheets" && (
          <div className="space-y-4">
            <p className="text-xs text-center text-gray-400">
              {cheatSheets.length} printable clinical reference PDFs — tap to open or save
            </p>
            <input
              type="search"
              value={cheatSearch}
              onChange={(e) => setCheatSearch(e.target.value)}
              placeholder="Search cheat sheets…"
              className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCheatCategory("all")}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  cheatCategory === "all"
                    ? "border-amber-400 text-amber-200"
                    : "border-white/10 text-gray-400"
                }`}
              >
                All ({cheatSheets.length})
              </button>
              {CLINICAL_CHEAT_SHEET_CATEGORIES.map((cat) => {
                const count = cheatSheets.filter((s) => s.category === cat.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCheatCategory(cat.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      cheatCategory === cat.id
                        ? "border-amber-400 text-amber-200"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    {cat.icon} {cat.label} ({count})
                  </button>
                );
              })}
            </div>
            <div className="space-y-2 max-h-[32rem] overflow-y-auto pr-1">
              {filteredCheatSheets.map((s) => (
                <CheatSheetCard key={s.id} sheet={s} />
              ))}
              {filteredCheatSheets.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-6">No cheat sheets match.</p>
              )}
            </div>
          </div>
        )}

        {tab === "social" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSocialPack("week1")}
                className={`flex-1 rounded-xl border-2 py-2 text-xs font-bold ${
                  socialPack === "week1"
                    ? "border-purple-500 bg-purple-500/20 text-white"
                    : "border-white/10 text-gray-400"
                }`}
              >
                Week 1 (3 posts)
              </button>
              <button
                type="button"
                onClick={() => setSocialPack("july")}
                className={`flex-1 rounded-xl border-2 py-2 text-xs font-bold ${
                  socialPack === "july"
                    ? "border-purple-500 bg-purple-500/20 text-white"
                    : "border-white/10 text-gray-400"
                }`}
              >
                Full July (12 posts)
              </button>
            </div>
            <p className="text-xs text-center text-gray-400">
              Copy caption → download image → paste to Facebook, Instagram, or Google Business
            </p>
            <div className="space-y-4">
              {socialPosts.map((post) => (
                <SocialPostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}

        {tab === "invoices" && (
          <div className="space-y-5">
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-100 font-medium mb-1">Quick picks</p>
              <p className="text-xs text-emerald-200/70 mb-3">
                Tap to open RX Invoices with template pre-selected (admin login required).
              </p>
              <div className="space-y-2">
                {invoiceQuickPicks.map((t) => (
                  <InvoiceRow key={t.id} template={t} />
                ))}
              </div>
            </div>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">
                All invoice templates ({allInvoices.length})
              </h2>
              <input
                type="search"
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                placeholder="Search invoices…"
                className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 mb-3"
              />
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setInvoiceTrack("all")}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    invoiceTrack === "all"
                      ? "border-emerald-400 text-emerald-200"
                      : "border-white/10 text-gray-400"
                  }`}
                >
                  All
                </button>
                {invoiceTracks.map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setInvoiceTrack(tr.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      invoiceTrack === tr.id
                        ? "border-emerald-400 text-emerald-200"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    {tr.label} ({tr.count})
                  </button>
                ))}
              </div>
              <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
                {filteredInvoices.map((t) => (
                  <InvoiceRow key={t.id} template={t} />
                ))}
                {filteredInvoices.length === 0 && (
                  <p className="text-center text-sm text-gray-500 py-6">No templates match.</p>
                )}
              </div>
            </section>

            <a
              href="/admin/rx-invoices"
              className="block text-center rounded-2xl border-2 border-emerald-500/50 bg-emerald-600/20 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-600/30 transition-colors"
            >
              Open full RX Invoices console →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
