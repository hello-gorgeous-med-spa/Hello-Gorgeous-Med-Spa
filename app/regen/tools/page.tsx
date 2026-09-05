import type { Metadata } from 'next';
import Link from 'next/link';
import { RegenPublicNav } from '@/components/regen/RegenPublicNav';
import { REGEN_PUBLIC_TOOLS } from '@/lib/regen/public-tools';

export const metadata: Metadata = {
  title: 'Free Tools',
  description: 'Free REGEN RX tools: protein and BMI calculators, GLP-1 titration tracker, peptide matcher, hormone symptom checker, IV finder, injection site rotation, and savings estimator.',
};

const BRAND = { teal: '#0D9488', pink: '#E91E8C', dark: '#0A0A0A', cream: '#FAF9F6', gray: '#9CA3AF' };

export default function ToolsHubPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.dark }}>
      <RegenPublicNav />
      <section className="pt-28 pb-10 px-6 text-center">
        <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: BRAND.teal }}>Free Tools</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Plan your protocol before you book</h1>
        <p className="max-w-2xl mx-auto text-lg" style={{ color: BRAND.gray }}>
          Eight quick tools to understand your numbers, find the right conversation, and see what to expect — built by the same Illinois team that treats you.
        </p>
      </section>
      <section className="px-6 pb-20 max-w-5xl mx-auto grid sm:grid-cols-2 gap-4">
        {REGEN_PUBLIC_TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="block rounded-2xl p-6 border hover:border-white/30 transition-colors"
            style={{ backgroundColor: '#111', borderColor: `${BRAND.teal}25` }}
          >
            <h2 className="text-xl font-bold text-white mb-2">{tool.title}</h2>
            <p className="text-sm" style={{ color: BRAND.gray }}>{tool.blurb}</p>
          </Link>
        ))}
      </section>
      <p className="text-center text-xs pb-16 px-6" style={{ color: BRAND.gray }}>
        Educational only — not a diagnosis, prescription, or guarantee. Ryan Kent, FNP-BC sets any plan after intake.
      </p>
    </div>
  );
}
