import { Metadata } from 'next';

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
  },
};

export default function RegenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
