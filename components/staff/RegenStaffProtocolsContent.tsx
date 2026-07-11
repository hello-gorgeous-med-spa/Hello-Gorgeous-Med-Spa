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
      className="w-full rounded-xl border-2 border-[#E6007E]/30 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-[#E6007E] transition-colors hover:border-[#E6007E] hover:bg-rose-100"
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
      className="block overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white shadow-sm transition-all hover:border-[#E6007E]/50 hover:shadow-md"
    >
      {sheet.thumbnail ? (
        <div className="relative h-32 w-full border-b border-neutral-100 bg-neutral-50">
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
        <span className="shrink-0 text-2xl">{cat?.icon ?? "📑"}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold leading-snug text-neutral-900">{sheet.title}</h3>
          <p className="mt-1 text-xs text-neutral-600">{sheet.description}</p>
          {cat ? (
            <p className="mt-1.5 text-[10px] uppercase tracking-wider text-neutral-400">{cat.label}</p>
          ) : null}
        </div>
        <span className="shrink-0 text-xs font-bold text-[#E6007E]">PDF</span>
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
      className="block rounded-2xl border-2 border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-[#E6007E]/50 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 text-2xl">{guide.format === "html" ? "🌐" : "📄"}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold leading-snug text-neutral-900">{guide.title}</h3>
          <p className="mt-1 text-xs text-neutral-600">{guide.description}</p>
        </div>
        <span className="shrink-0 text-[#E6007E]">→</span>
      </div>
    </a>
  );
}

function SocialPostCard({ post }: { post: RegenStaffSocialPost }) {
  const img = post.staffImagePath ?? post.imagePath;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white shadow-sm">
      <div className="relative aspect-square w-full bg-neutral-100">
        <Image
          src={img}
          alt={post.label}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 400px"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">
            {post.dayLabel}
          </span>
          <span className="text-xs text-neutral-500">{post.channels.join(" · ")}</span>
        </div>
        <h3 className="text-sm font-bold text-neutral-900">{post.label}</h3>
        <p className="line-clamp-4 whitespace-pre-line text-xs text-neutral-700">{post.message}</p>
        <div className="flex flex-col gap-2">
          <CopyButton text={post.message} />
          <a
            href={img}
            download
            className="rounded-xl border-2 border-sky-200 bg-sky-50 px-4 py-2.5 text-center text-sm font-semibold text-sky-800 transition-colors hover:border-sky-400"
          >
            Download image
          </a>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-xs text-[#E6007E] underline decoration-[#E6007E]/40"
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
      className="flex items-center gap-3 rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 transition-all hover:border-emerald-400 hover:shadow-sm"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-900">{template.name}</p>
        <p className="truncate text-xs text-neutral-500">{template.group}</p>
      </div>
      <span className="shrink-0 font-bold text-emerald-700">{formatUsd(template.amountUsd)}</span>
      <span className="shrink-0 text-emerald-600">→</span>
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
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-lg px-4 py-8 pb-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/staff"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#E6007E] hover:text-[#c9006e]"
          >
            ← Staff Hub
          </Link>
          <Link
            href="/admin/rx/ops"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            RX Ops Console →
          </Link>
        </div>

        <div className="mb-8 text-center">
          <img
            src="/images/regen/regen-logo.png"
            alt="RE GEN"
            className="mx-auto mb-4 h-16 rounded-lg"
          />
          <h1 className="mb-1 font-serif text-2xl font-bold text-neutral-900">
            Protocols &amp; Quick Tools
          </h1>
          <p className="text-sm text-neutral-600">
            Guides · clinical cheat sheets · social · RX invoices
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TAB_LABELS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl border-2 px-2 py-2.5 text-xs font-bold transition-all ${
                tab === t.id
                  ? "border-[#E6007E] bg-rose-50 text-[#E6007E] shadow-sm"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-[#E6007E]/40"
              }`}
            >
              <span className="mb-0.5 block text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <Link
          href="/admin/promos/bestie"
          className="mb-6 block rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 transition-colors hover:bg-amber-100/80"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Bestie program</p>
          <p className="mt-1 font-mono text-lg font-black text-neutral-900">
            {BESTIE_SQUARE_DISCOUNT.code}
          </p>
          <p className="mt-0.5 text-sm text-amber-900/80">
            ${BESTIE_SQUARE_DISCOUNT.amountUsd} off — Square checkout or POS only (not in-app)
          </p>
        </Link>

        {tab === "guides" && (
          <div className="space-y-6">
            {Object.entries(guidesByCategory).map(([heading, guides]) => (
              <section key={heading}>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#E6007E]">
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
            <p className="text-center text-xs text-neutral-600">
              {cheatSheets.length} printable clinical reference PDFs — tap to open or save
            </p>
            <input
              type="search"
              value={cheatSearch}
              onChange={(e) => setCheatSearch(e.target.value)}
              placeholder="Search cheat sheets…"
              className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#E6007E] focus:outline-none focus:ring-2 focus:ring-[#E6007E]/20"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCheatCategory("all")}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  cheatCategory === "all"
                    ? "border-[#E6007E] bg-rose-50 text-[#E6007E]"
                    : "border-neutral-200 bg-white text-neutral-600"
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
                        ? "border-[#E6007E] bg-rose-50 text-[#E6007E]"
                        : "border-neutral-200 bg-white text-neutral-600"
                    }`}
                  >
                    {cat.icon} {cat.label} ({count})
                  </button>
                );
              })}
            </div>
            <div className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
              {filteredCheatSheets.map((s) => (
                <CheatSheetCard key={s.id} sheet={s} />
              ))}
              {filteredCheatSheets.length === 0 && (
                <p className="py-6 text-center text-sm text-neutral-500">No cheat sheets match.</p>
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
                    ? "border-[#E6007E] bg-rose-50 text-[#E6007E]"
                    : "border-neutral-200 bg-white text-neutral-600"
                }`}
              >
                Week 1 (3 posts)
              </button>
              <button
                type="button"
                onClick={() => setSocialPack("july")}
                className={`flex-1 rounded-xl border-2 py-2 text-xs font-bold ${
                  socialPack === "july"
                    ? "border-[#E6007E] bg-rose-50 text-[#E6007E]"
                    : "border-neutral-200 bg-white text-neutral-600"
                }`}
              >
                Full July (12 posts)
              </button>
            </div>
            <p className="text-center text-xs text-neutral-600">
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
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
              <p className="mb-1 text-sm font-medium text-emerald-900">Quick picks</p>
              <p className="mb-3 text-xs text-emerald-800/80">
                Tap to open RX Invoices with template pre-selected (admin login required).
              </p>
              <div className="space-y-2">
                {invoiceQuickPicks.map((t) => (
                  <InvoiceRow key={t.id} template={t} />
                ))}
              </div>
            </div>

            <section>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700">
                All invoice templates ({allInvoices.length})
              </h2>
              <input
                type="search"
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                placeholder="Search invoices…"
                className="mb-3 w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceTrack("all")}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    invoiceTrack === "all"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-neutral-200 bg-white text-neutral-600"
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
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-neutral-200 bg-white text-neutral-600"
                    }`}
                  >
                    {tr.label} ({tr.count})
                  </button>
                ))}
              </div>
              <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                {filteredInvoices.map((t) => (
                  <InvoiceRow key={t.id} template={t} />
                ))}
                {filteredInvoices.length === 0 && (
                  <p className="py-6 text-center text-sm text-neutral-500">No templates match.</p>
                )}
              </div>
            </section>

            <a
              href="/admin/rx-invoices"
              className="block rounded-2xl border-2 border-emerald-500 bg-emerald-600 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            >
              Open full RX Invoices console →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
