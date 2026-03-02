import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'morpheus8')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `Morpheus8 RF Microneedling Oswego IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `Morpheus8 RF Microneedling in Oswego, IL. Deepest RF technology with Burst + Quantum probes. Face & body contouring, skin tightening, fat reduction. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Oswego'),
  alternates: { canonical: `${SITE.url}/morpheus8-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/morpheus8-oswego-il`,
    title: `Morpheus8 Oswego IL | Hello Gorgeous Med Spa`,
    description: 'Morpheus8 RF Microneedling in Oswego, IL. Face & body contouring with Burst + Quantum technology.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function Morpheus8OswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
