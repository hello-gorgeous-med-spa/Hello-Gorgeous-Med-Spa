import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'morpheus8')!;
const area = SERVICE_AREAS.find(a => a.slug === 'yorkville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'yorkville');

export const metadata: Metadata = {
  title: `Morpheus8 Near Me | Yorkville IL | RF Microneedling & Burst — Hello Gorgeous`,
  description: `Morpheus8 near Yorkville, IL? Hello Gorgeous is just 8 min away. Morpheus8 Burst RF microneedling for face & body — skin tightening, scars, contouring. Free consult.`,
  keywords: [...generateLocationKeywords(service, 'Yorkville'), 'morpheus8 burst yorkville il', 'rf microneedling yorkville', 'skin tightening yorkville'],
  alternates: { canonical: `${SITE.url}/morpheus8-yorkville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/morpheus8-yorkville-il`,
    title: `Morpheus8 Yorkville IL | Hello Gorgeous`,
    description: 'Morpheus8 Burst RF microneedling near Yorkville, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function Morpheus8YorkvillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
