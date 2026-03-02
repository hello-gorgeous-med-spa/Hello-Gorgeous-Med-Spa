import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'morpheus8')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `Morpheus8 RF Microneedling Aurora IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `Morpheus8 RF Microneedling near Aurora, IL. Deepest RF technology with Burst + Quantum probes. Face & body contouring, skin tightening, fat reduction. 10 min from Aurora. Book now!`,
  keywords: generateLocationKeywords(service, 'Aurora'),
  alternates: { canonical: `${SITE.url}/morpheus8-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/morpheus8-aurora-il`,
    title: `Morpheus8 Near Aurora IL | Hello Gorgeous Med Spa`,
    description: 'Morpheus8 RF Microneedling near Aurora, IL. Face & body contouring with Burst + Quantum technology.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function Morpheus8AuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
