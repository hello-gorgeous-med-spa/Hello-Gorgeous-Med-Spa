import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'dermal-fillers')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `Dermal Fillers Naperville IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `Looking for dermal fillers near Naperville, IL? Hello Gorgeous Med Spa is 15 min away. Juvederm, Restylane, cheek & jawline fillers. Licensed NPs. Free consultation!`,
  keywords: generateLocationKeywords(service, 'Naperville'),
  alternates: { canonical: `${SITE.url}/dermal-fillers-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dermal-fillers-naperville-il`,
    title: `Dermal Fillers Naperville IL | Hello Gorgeous Med Spa`,
    description: 'Dermal fillers near Naperville, IL. 15 min away. Free consultations.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function DermalFillersNapervillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
