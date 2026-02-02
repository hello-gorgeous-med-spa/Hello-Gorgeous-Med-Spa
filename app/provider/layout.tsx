import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Provider Portal | Hello Gorgeous Med Spa',
  description: 'Provider dashboard for managing appointments and charting',
};

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
