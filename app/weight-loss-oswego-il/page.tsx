import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'weight-loss')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

// Revalidate hourly so new Google reviews synced into Supabase appear
// on the page within the hour without redeploying. ISR-friendly.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Weight Loss in Oswego, IL 60543 — Semaglutide & Tirzepatide | Hello Gorgeous Med Spa`,
  description: `Medical weight loss in Oswego, IL — Semaglutide (Ozempic/Wegovy) and Tirzepatide (Mounjaro/Zepbound) GLP-1 programs supervised by licensed nurse practitioners. Free consultations. Serving Naperville, Aurora, Plainfield, Yorkville. Call 630-636-6193.`,
  keywords: [...generateLocationKeywords(service, 'Oswego'), 'weight loss oswego', 'weight loss oswego il', 'semaglutide oswego', 'tirzepatide oswego', 'glp1 oswego', 'ozempic oswego', 'wegovy oswego', 'mounjaro oswego', 'zepbound oswego', 'medical weight loss oswego', 'weight loss near me'],
  alternates: { canonical: `${SITE.url}/weight-loss-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/weight-loss-oswego-il`,
    title: `Weight Loss in Oswego, IL — Semaglutide & Tirzepatide | Hello Gorgeous Med Spa`,
    description: 'Semaglutide & Tirzepatide GLP-1 weight loss in Oswego, IL — supervised by licensed NPs. Free consultations.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function WeightLossOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
