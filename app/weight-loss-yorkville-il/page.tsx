import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'weight-loss')!;
const area = SERVICE_AREAS.find(a => a.slug === 'yorkville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'yorkville');

export const metadata: Metadata = {
  title: `Weight Loss Near Me | Yorkville IL | Semaglutide & Tirzepatide — Hello Gorgeous`,
  description: `Medical weight loss near Yorkville, IL? Hello Gorgeous is just 8 min away. Semaglutide, Tirzepatide, Ozempic, Mounjaro — provider-supervised. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Yorkville'), 'weight loss near me yorkville', 'ozempic yorkville il', 'wegovy yorkville', 'mounjaro yorkville'],
  alternates: { canonical: `${SITE.url}/weight-loss-yorkville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/weight-loss-yorkville-il`,
    title: `Medical Weight Loss Yorkville IL | Hello Gorgeous`,
    description: 'Semaglutide & Tirzepatide near Yorkville, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function WeightLossYorkvillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
