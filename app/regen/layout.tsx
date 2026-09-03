import { Metadata } from 'next';
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
      {children}
    </RegenAuthProvider>
  );
}
