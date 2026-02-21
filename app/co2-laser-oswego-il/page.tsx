import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'co2-laser')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `CO₂ Fractional Laser Oswego IL | InMode Solaria | Hello Gorgeous Med Spa`,
  description: `CO₂ Fractional Laser in Oswego, IL. InMode Solaria for wrinkles, acne scars, skin resurfacing. Gold standard skin rejuvenation. Book consultation!`,
  keywords: [...generateLocationKeywords(service, 'Oswego'), 'solaria laser oswego', 'fractional laser oswego', 'skin resurfacing oswego'],
  alternates: { canonical: `${SITE.url}/co2-laser-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/co2-laser-oswego-il`,
    title: `CO₂ Fractional Laser Oswego IL | Solaria | Hello Gorgeous`,
    description: 'CO₂ laser skin resurfacing in Oswego, IL. InMode Solaria.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function CO2LaserOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
