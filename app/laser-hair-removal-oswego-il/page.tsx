import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'laser-hair-removal')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `Laser Hair Removal Oswego IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `Laser hair removal in Oswego, IL. Permanent hair reduction for bikini, underarms, legs, face & body. Professional laser treatment. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Oswego'),
  alternates: { canonical: `${SITE.url}/laser-hair-removal-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/laser-hair-removal-oswego-il`,
    title: `Laser Hair Removal Oswego IL | Hello Gorgeous`,
    description: 'Laser hair removal in Oswego, IL. All body areas.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function LaserHairRemovalOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
