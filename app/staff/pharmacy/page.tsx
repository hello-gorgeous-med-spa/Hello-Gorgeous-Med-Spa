import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pharmacy Selector | Hello Gorgeous Staff',
  robots: 'noindex, nofollow',
};

export default function PharmacySelectorPage() {
  return (
    <iframe
      src="/staff/pharmacy-selector.html"
      className="w-full h-screen border-0"
      title="Pharmacy Selector"
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}
