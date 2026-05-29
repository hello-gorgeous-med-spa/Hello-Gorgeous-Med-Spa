import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'weight-loss')!;
const area = SERVICE_AREAS.find(a => a.slug === 'montgomery')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'montgomery');

export const metadata: Metadata = {
  title: `Weight Loss Near Me | Montgomery IL | Semaglutide & Tirzepatide — Hello Gorgeous`,
  description: `Medical weight loss near Montgomery, IL? Hello Gorgeous is right next door (under 10 min). Semaglutide, Tirzepatide, Ozempic, Mounjaro — provider-supervised. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Montgomery'), 'weight loss near me montgomery', 'ozempic montgomery il', 'wegovy montgomery', 'mounjaro montgomery'],
  alternates: { canonical: `${SITE.url}/weight-loss-montgomery-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/weight-loss-montgomery-il`,
    title: `Medical Weight Loss Montgomery IL | Hello Gorgeous`,
    description: 'Semaglutide & Tirzepatide near Montgomery, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function WeightLossMontgomeryPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
