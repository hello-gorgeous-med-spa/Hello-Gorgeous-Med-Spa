import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to REGEN RX',
  description: 'Your prescription wellness journey begins now.',
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
