import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'dermal-fillers')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `Dermal Fillers Near Me | Aurora IL | ${service.priceDisplay} — Hello Gorgeous Med Spa`,
  description: `Fillers near me in Aurora, IL? Hello Gorgeous is 10 min away. Juvederm, Restylane, cheek, lip, jawline. Free consultation. Serving Aurora, North Aurora, Montgomery.`,
  keywords: [...generateLocationKeywords(service, 'Aurora'), 'fillers near me aurora'],
  alternates: { canonical: `${SITE.url}/dermal-fillers-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dermal-fillers-aurora-il`,
    title: `Dermal Fillers Aurora IL | Hello Gorgeous Med Spa`,
    description: 'Dermal fillers near Aurora, IL. 10 min away. Free consultations.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function DermalFillersAuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
