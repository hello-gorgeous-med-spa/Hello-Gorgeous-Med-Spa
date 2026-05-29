import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'weight-loss')!;
const area = SERVICE_AREAS.find(a => a.slug === 'plainfield')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'plainfield');

export const metadata: Metadata = {
  title: `Weight Loss Near Me | Plainfield IL | Semaglutide & Tirzepatide — Hello Gorgeous`,
  description: `Medical weight loss near Plainfield, IL? Hello Gorgeous is about 12 min away. Semaglutide, Tirzepatide, Ozempic, Mounjaro — provider-supervised. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Plainfield'), 'weight loss near me plainfield', 'ozempic plainfield il', 'wegovy plainfield', 'mounjaro plainfield'],
  alternates: { canonical: `${SITE.url}/weight-loss-plainfield-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/weight-loss-plainfield-il`,
    title: `Medical Weight Loss Plainfield IL | Hello Gorgeous`,
    description: 'Semaglutide & Tirzepatide near Plainfield, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function WeightLossPlainfieldPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
