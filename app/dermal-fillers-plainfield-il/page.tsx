import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'dermal-fillers')!;
const area = SERVICE_AREAS.find(a => a.slug === 'plainfield')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'plainfield');

export const metadata: Metadata = {
  title: `Dermal Fillers Near Me | Plainfield IL | Juvederm & Restylane — Hello Gorgeous`,
  description: `Dermal fillers near Plainfield, IL? Hello Gorgeous is about 12 min away. Juvederm, Restylane, RHA — cheeks, jawline, lips. NP-placed. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Plainfield'), 'cheek filler plainfield il', 'jawline filler plainfield', 'lip filler plainfield'],
  alternates: { canonical: `${SITE.url}/dermal-fillers-plainfield-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dermal-fillers-plainfield-il`,
    title: `Dermal Fillers Plainfield IL | Hello Gorgeous`,
    description: 'Premium dermal fillers near Plainfield, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function DermalFillersPlainfieldPage() {
  return (
    <LocationServicePage
      service={service}
      area={area}
      nearbyAreas={nearbyAreas}
      localIntro="Plainfield clients visit us for full-face filler mapping — cheeks, jawline, chin, and lips — about 12 minutes east via Route 126 to Route 34. Juvederm, Restylane, Revanesse, and RHA are selected at consult for your anatomy and goals."
    />
  );
}
