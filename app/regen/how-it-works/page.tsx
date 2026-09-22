import type { Metadata } from 'next';
import Link from 'next/link';

import { RegenPublicNav } from '@/components/regen/RegenPublicNav';
import {
  REGEN_HOW_IT_WORKS_EYEBROW,
  REGEN_HOW_IT_WORKS_FOOTNOTE,
  REGEN_HOW_IT_WORKS_HEADLINE,
  REGEN_HOW_IT_WORKS_LEDE,
  REGEN_HOW_IT_WORKS_PRIMARY_CTA,
  REGEN_HOW_IT_WORKS_SECONDARY_CTA,
  REGEN_HOW_IT_WORKS_SECONDARY_HREF,
  REGEN_HOW_IT_WORKS_STEPS,
  REGEN_START_PATH,
} from '@/lib/regen/how-it-works';

export const metadata: Metadata = {
  title: 'How it works — REGEN RX',
  description:
    'Three steps: check eligibility online, a licensed Illinois clinician reviews your request, then you pay a clinic invoice and a licensed pharmacy ships to your Illinois door.',
  alternates: { canonical: 'https://tryregenrx.com/how-it-works' },
};

const BRAND = {
  teal: '#0D9488',
  pink: '#E91E8C',
  dark: '#0A0A0A',
  darkAlt: '#111111',
  cream: '#FAF9F6',
  gray: '#9CA3AF',
};

function CtaRow() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link
        href={REGEN_START_PATH}
        className="inline-flex justify-center rounded-full px-8 py-4 text-sm font-bold text-white"
        style={{ backgroundColor: BRAND.pink }}
      >
        {REGEN_HOW_IT_WORKS_PRIMARY_CTA}
      </Link>
      <Link
        href={REGEN_HOW_IT_WORKS_SECONDARY_HREF}
        className="inline-flex justify-center rounded-full px-8 py-4 text-sm font-bold border-2"
        style={{ borderColor: BRAND.teal, color: BRAND.teal }}
      >
        {REGEN_HOW_IT_WORKS_SECONDARY_CTA}
      </Link>
    </div>
  );
}

export default function RegenHowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      <RegenPublicNav />
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <p
          className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
          style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal, border: `1px solid ${BRAND.teal}40` }}
        >
          {REGEN_HOW_IT_WORKS_EYEBROW}
        </p>
        <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: BRAND.cream }}>
          {REGEN_HOW_IT_WORKS_HEADLINE}
        </h1>
        <p className="text-lg mb-10" style={{ color: BRAND.gray }}>
          {REGEN_HOW_IT_WORKS_LEDE}
        </p>

        <ol className="space-y-6 mb-12">
          {REGEN_HOW_IT_WORKS_STEPS.map((step) => (
            <li
              key={step.num}
              className="rounded-2xl p-6"
              style={{ backgroundColor: BRAND.darkAlt, border: `1px solid ${BRAND.teal}30` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black text-white"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  {step.num}
                </span>
                <h2 className="text-xl font-bold" style={{ color: BRAND.cream }}>
                  {step.title}
                </h2>
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline"
                  style={{ backgroundColor: `${BRAND.teal}20`, color: BRAND.teal }}
                >
                  {step.time}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: BRAND.gray }}>
                {step.desc}
              </p>
            </li>
          ))}
        </ol>

        <CtaRow />
        <p className="mt-8 text-center text-sm" style={{ color: BRAND.gray }}>
          {REGEN_HOW_IT_WORKS_FOOTNOTE}
        </p>
      </main>
    </div>
  );
}
