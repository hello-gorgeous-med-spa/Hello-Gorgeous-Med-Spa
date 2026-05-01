import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'morpheus8')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

// Revalidate hourly so new Google reviews synced into Supabase appear
// on the page within the hour without redeploying. ISR-friendly.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Morpheus8 in Oswego, IL 60543 — RF Microneedling | Hello Gorgeous Med Spa`,
  description: `Morpheus8 RF microneedling in Oswego, IL — the deepest RF technology with Burst and Quantum probes for face and body contouring, skin tightening, and acne scars. Licensed nurse practitioners. Free consultations. Call 630-636-6193.`,
  keywords: [...generateLocationKeywords(service, 'Oswego'), 'morpheus8 oswego', 'morpheus 8 oswego', 'morpheus8 oswego il', 'morpheus8 burst oswego', 'rf microneedling oswego', 'skin tightening oswego', 'quantum rf oswego'],
  alternates: { canonical: `${SITE.url}/morpheus8-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/morpheus8-oswego-il`,
    title: `Morpheus8 in Oswego, IL — RF Microneedling | Hello Gorgeous Med Spa`,
    description: 'Morpheus8 RF microneedling in Oswego, IL with the deepest RF technology — face, body, acne scars.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function Morpheus8OswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
