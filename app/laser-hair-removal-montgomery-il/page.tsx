import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'laser-hair-removal')!;
const area = SERVICE_AREAS.find(a => a.slug === 'montgomery')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'montgomery');

export const metadata: Metadata = {
  title: `Laser Hair Removal Montgomery IL | ${service.priceDisplay} | Hello Gorgeous`,
  description: `Laser hair removal near Montgomery, IL. 10 min away. Bikini, underarms, legs, face & body. Professional laser treatment. Memberships from $69/month. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Montgomery'),
  alternates: { canonical: `${SITE.url}/laser-hair-removal-montgomery-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/laser-hair-removal-montgomery-il`,
    title: `Laser Hair Removal Montgomery IL | Hello Gorgeous`,
    description: 'Laser hair removal near Montgomery, IL. Memberships from $69/month.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function LaserHairRemovalMontgomeryPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
