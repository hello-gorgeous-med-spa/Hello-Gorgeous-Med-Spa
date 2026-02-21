import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'dermal-fillers')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `Dermal Fillers Oswego IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `Looking for dermal fillers in Oswego, IL? Hello Gorgeous Med Spa offers Juvederm, Restylane & premium fillers. Cheek, jawline, lip fillers. Licensed NPs. Book free consultation!`,
  keywords: generateLocationKeywords(service, 'Oswego'),
  alternates: { canonical: `${SITE.url}/dermal-fillers-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dermal-fillers-oswego-il`,
    title: `Dermal Fillers Oswego IL | Hello Gorgeous Med Spa`,
    description: 'Premium dermal fillers in Oswego, IL. Cheek, jawline, lip enhancement. Free consultations.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function DermalFillersOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
