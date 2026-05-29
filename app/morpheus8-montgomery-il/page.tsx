import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'morpheus8')!;
const area = SERVICE_AREAS.find(a => a.slug === 'montgomery')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'montgomery');

export const metadata: Metadata = {
  title: `Morpheus8 Near Me | Montgomery IL | RF Microneedling & Burst — Hello Gorgeous`,
  description: `Morpheus8 near Montgomery, IL? Hello Gorgeous is right next door (under 10 min). Morpheus8 Burst RF microneedling for face & body — skin tightening, scars, contouring. Free consult.`,
  keywords: [...generateLocationKeywords(service, 'Montgomery'), 'morpheus8 burst montgomery il', 'rf microneedling montgomery', 'skin tightening montgomery'],
  alternates: { canonical: `${SITE.url}/morpheus8-montgomery-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/morpheus8-montgomery-il`,
    title: `Morpheus8 Montgomery IL | Hello Gorgeous`,
    description: 'Morpheus8 Burst RF microneedling near Montgomery, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function Morpheus8MontgomeryPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
