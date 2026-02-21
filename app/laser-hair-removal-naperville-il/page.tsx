import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'laser-hair-removal')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `Laser Hair Removal Naperville IL | ${service.priceDisplay} | Hello Gorgeous`,
  description: `Laser hair removal near Naperville, IL. 15 min away. Bikini, underarms, legs, face & body. Professional laser treatment. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Naperville'),
  alternates: { canonical: `${SITE.url}/laser-hair-removal-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/laser-hair-removal-naperville-il`,
    title: `Laser Hair Removal Naperville IL | Hello Gorgeous`,
    description: 'Laser hair removal near Naperville, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function LaserHairRemovalNapervillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
