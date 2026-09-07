"use client";

import Link from "next/link";

import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import { RegenAffiliateSubnav } from "@/components/regen/RegenAffiliateSubnav";
import {
  AFFILIATE_KIT_PLAYBOOK,
  AFFILIATE_MARKETING_PATH,
  AFFILIATE_POSTING_RULES,
} from "@/lib/regen/affiliate-marketing";

const BRAND = { teal: "#1FB8A6", pink: "#EF1A6E", dark: "#0f1414", cream: "#f4ead9" };

export function RegenAffiliatePlaybook() {
  const html = AFFILIATE_KIT_PLAYBOOK.find((d) => d.kind === "html");
  const manual = AFFILIATE_KIT_PLAYBOOK.find((d) => d.kind === "markdown");

  return (
    <div className="min-h-screen" style={{ background: BRAND.dark, color: BRAND.cream }}>
      <RegenPublicNav />
      <RegenAffiliateSubnav />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: BRAND.pink }}>
          Partner playbook
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black">How we talk. How we run it.</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          The REGEN RX playbook and manual. Use the scripts. Do not post pharmacy names, refund SOPs, or anything
          that sounds like you are the prescriber.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {html ? (
            <a
              href={html.href}
              download={html.downloadName}
              className="rounded-full px-6 py-3 text-sm font-bold text-black"
              style={{ background: BRAND.teal }}
            >
              Download playbook
            </a>
          ) : null}
          {manual ? (
            <a
              href={manual.href}
              download={manual.downloadName}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white"
            >
              Download manual
            </a>
          ) : null}
          <Link href={AFFILIATE_MARKETING_PATH} className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold">
            Marketing kit
          </Link>
        </div>
      </section>

      <section className="bg-white px-6 py-10 text-[#101615]">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl font-black">Non-negotiables for posts</h2>
          <ul className="mt-5 space-y-2 text-sm leading-6 text-black/75">
            {AFFILIATE_POSTING_RULES.map((rule) => (
              <li key={rule}>▸ {rule}</li>
            ))}
          </ul>
        </div>
      </section>

      {html ? (
        <section className="px-6 py-10">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-white">
            <iframe title="REGEN RX playbook" src={html.href} className="h-[80vh] w-full border-0" />
          </div>
        </section>
      ) : null}
    </div>
  );
}
