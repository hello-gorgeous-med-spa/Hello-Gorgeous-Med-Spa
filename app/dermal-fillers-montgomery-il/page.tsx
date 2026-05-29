import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'dermal-fillers')!;
const area = SERVICE_AREAS.find(a => a.slug === 'montgomery')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'montgomery');

export const metadata: Metadata = {
  title: `Dermal Fillers Near Me | Montgomery IL | Juvederm & Restylane — Hello Gorgeous`,
  description: `Dermal fillers near Montgomery, IL? Hello Gorgeous is right next door (under 10 min). Juvederm, Restylane, RHA — cheeks, jawline, lips. NP-placed. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Montgomery'), 'cheek filler montgomery il', 'jawline filler montgomery', 'lip filler montgomery'],
  alternates: { canonical: `${SITE.url}/dermal-fillers-montgomery-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dermal-fillers-montgomery-il`,
    title: `Dermal Fillers Montgomery IL | Hello Gorgeous`,
    description: 'Premium dermal fillers near Montgomery, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function DermalFillersMontgomeryPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
