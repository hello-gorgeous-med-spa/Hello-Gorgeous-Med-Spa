import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'laser-hair-removal')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `Laser Hair Removal Aurora IL | ${service.priceDisplay} | Hello Gorgeous`,
  description: `Laser hair removal near Aurora, IL. 10 min away. Bikini, underarms, legs, face & body. Professional laser treatment. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Aurora'),
  alternates: { canonical: `${SITE.url}/laser-hair-removal-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/laser-hair-removal-aurora-il`,
    title: `Laser Hair Removal Aurora IL | Hello Gorgeous`,
    description: 'Laser hair removal near Aurora, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function LaserHairRemovalAuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
