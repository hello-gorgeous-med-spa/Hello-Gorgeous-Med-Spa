import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'weight-loss')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `Medical Weight Loss Oswego IL | Semaglutide & Tirzepatide | Hello Gorgeous`,
  description: `Medical weight loss in Oswego, IL. Semaglutide (Ozempic/Wegovy) & Tirzepatide (Mounjaro) available. GLP-1 weight loss program supervised by nurse practitioners. Book consultation!`,
  keywords: [...generateLocationKeywords(service, 'Oswego'), 'ozempic oswego', 'wegovy oswego', 'mounjaro oswego'],
  alternates: { canonical: `${SITE.url}/weight-loss-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/weight-loss-oswego-il`,
    title: `Medical Weight Loss Oswego IL | Semaglutide | Hello Gorgeous`,
    description: 'Semaglutide & Tirzepatide weight loss in Oswego, IL. GLP-1 program.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function WeightLossOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
