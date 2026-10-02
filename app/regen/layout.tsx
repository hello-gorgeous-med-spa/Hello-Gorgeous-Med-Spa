import { Metadata } from 'next';
import Link from 'next/link';
import { RegenAffiliateTracker } from '@/components/regen/RegenAffiliateTracker';
import { RegenAuthProvider } from '@/components/regen/RegenAuthProvider';

export const metadata: Metadata = {
  title: {
    default: 'REGEN RX | Prescription Wellness, Delivered',
    template: '%s | REGEN RX',
  },
  description: 'Doctor-guided weight loss, hormone therapy, and peptides. Illinois telehealth with licensed providers. Get started in minutes.',
  openGraph: {
    title: 'REGEN RX | Prescription Wellness, Delivered',
    description: 'Doctor-guided weight loss, hormone therapy, and peptides. Illinois telehealth with licensed providers.',
    type: 'website',
    siteName: 'REGEN RX',
    images: [
      {
        url: 'https://tryregenrx.com/images/regen/regen-og-image.png',
        width: 1200,
        height: 630,
        alt: 'REGEN RX - Prescription Wellness, Delivered',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REGEN RX | Prescription Wellness, Delivered',
    description: 'Doctor-guided weight loss, hormone therapy, and peptides. Illinois telehealth.',
    images: ['https://tryregenrx.com/images/regen/regen-og-image.png'],
  },
};

export default function RegenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegenAuthProvider>
      <RegenAffiliateTracker />
      {children}
      <footer className="border-t border-white/10 bg-black px-6 py-8 text-center text-sm text-neutral-400">
        <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/hipaa" className="underline-offset-2 hover:text-white hover:underline">HIPAA Notice</Link>
          <Link href="/privacy" className="underline-offset-2 hover:text-white hover:underline">Privacy</Link>
          <Link href="/terms" className="underline-offset-2 hover:text-white hover:underline">Terms of Service</Link>
          <Link href="/refund" className="underline-offset-2 hover:text-white hover:underline">Refund Policy</Link>
        </nav>
        <p className="mx-auto mt-4 max-w-3xl leading-relaxed">
          A request is not a prescription. Ryan Kent, FNP-BC reviews every request before any clinic invoice or pharmacy order. This website does not sell medication and does not take a card.
        </p>
      </footer>
    </RegenAuthProvider>
  );
}
