import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'dermal-fillers')!;
const area = SERVICE_AREAS.find(a => a.slug === 'yorkville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'yorkville');

export const metadata: Metadata = {
  title: `Dermal Fillers Near Me | Yorkville IL | Juvederm & Restylane — Hello Gorgeous`,
  description: `Dermal fillers near Yorkville, IL? Hello Gorgeous is just 8 min away. Juvederm, Restylane, RHA — cheeks, jawline, lips. NP-placed. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Yorkville'), 'cheek filler yorkville il', 'jawline filler yorkville', 'lip filler yorkville'],
  alternates: { canonical: `${SITE.url}/dermal-fillers-yorkville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dermal-fillers-yorkville-il`,
    title: `Dermal Fillers Yorkville IL | Hello Gorgeous`,
    description: 'Premium dermal fillers near Yorkville, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function DermalFillersYorkvillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
