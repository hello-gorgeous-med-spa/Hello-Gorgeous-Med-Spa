"use client";

import Image from "next/image";
import Link from "next/link";

import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import { RegenAffiliateSubnav } from "@/components/regen/RegenAffiliateSubnav";
import {
  AFFILIATE_KIT_DOCS,
  AFFILIATE_KIT_PLAYBOOK,
  AFFILIATE_KIT_VIALS,
  AFFILIATE_PLAYBOOK_PATH,
  AFFILIATE_POSTING_RULES,
} from "@/lib/regen/affiliate-marketing";

const BRAND = { teal: "#1FB8A6", pink: "#EF1A6E", dark: "#0f1414", cream: "#f4ead9" };

export function RegenAffiliateMarketing() {
  return (
    <div className="min-h-screen" style={{ background: BRAND.dark, color: BRAND.cream }}>
      <RegenPublicNav />
      <RegenAffiliateSubnav />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: BRAND.pink }}>
          Partner marketing kit
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black md:text-5xl">Assets you can actually post.</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          Flyer, card, 30-second video, and vial art. Illinois adults only. A consult is not a guaranteed
          prescription. Compounded medication is not FDA-approved.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={AFFILIATE_PLAYBOOK_PATH}
            className="rounded-full px-6 py-3 text-sm font-bold text-black"
            style={{ background: BRAND.teal }}
          >
            Playbook &amp; manual
          </Link>
          <Link href="/flyer" className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white">
            Open live flyer
          </Link>
        </div>
      </section>

      <section className="bg-white px-6 py-14 text-[#101615]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-black">Print &amp; video</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {AFFILIATE_KIT_DOCS.map((asset) => (
              <article key={asset.id} className="rounded-2xl border-2 border-black p-6">
                <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: BRAND.pink }}>
                  {asset.kind}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-black">{asset.title}</h3>
                <p className="mt-2 text-sm text-black/65">{asset.blurb}</p>
                {asset.kind === "video" ? (
                  <video className="mt-4 w-full rounded-xl bg-black" controls playsInline src={asset.href} />
                ) : asset.kind === "image" ? (
                  <Image
                    src={asset.href}
                    alt={asset.title}
                    width={1200}
                    height={800}
                    className="mt-4 h-auto w-full rounded-xl"
                  />
                ) : null}
                <a
                  href={asset.href}
                  download={asset.downloadName}
                  className="mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-bold text-white"
                  style={{ background: BRAND.pink }}
                >
                  Download
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-black">Vial art</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/55">
            These are renders for posts. They are not a live menu and not a promised prescription. Do not invent
            product nicknames.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AFFILIATE_KIT_VIALS.map((asset) => (
              <article key={asset.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image
                  src={asset.href}
                  alt={asset.title}
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">{asset.title}</h3>
                  <p className="mt-1 text-xs text-white/50">{asset.blurb}</p>
                  <a href={asset.href} download className="mt-3 inline-block text-sm font-bold" style={{ color: BRAND.teal }}>
                    Download PNG
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14 text-[#101615]">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-black">What you may say</h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-black/75">
            {AFFILIATE_POSTING_RULES.map((rule) => (
              <li key={rule} className="rounded-xl border border-black/10 bg-[#f6f6f4] px-4 py-3">
                {rule}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {AFFILIATE_KIT_PLAYBOOK.map((doc) => (
              <a
                key={doc.id}
                href={doc.href}
                download={doc.downloadName}
                className="rounded-full px-5 py-2.5 text-sm font-bold text-white"
                style={{ background: BRAND.dark }}
              >
                {doc.title}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
