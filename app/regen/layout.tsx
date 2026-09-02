import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'RE GEN | Prescription Wellness',
    template: '%s | RE GEN',
  },
  description: 'Doctor-guided weight loss, hormone therapy, and peptides. Illinois telehealth with licensed providers.',
};

export default function RegenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
