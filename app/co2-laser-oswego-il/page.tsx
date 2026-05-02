import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'co2-laser')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `CO₂ Laser in Oswego, IL 60543 — $899 Full Face | Hello Gorgeous Med Spa`,
  description: `Solaria CO₂ fractional laser in Oswego, IL — full face $899 launch special. The only InMode Solaria in the Fox Valley. Treats wrinkles, acne scars, sun damage. Serving Naperville, Aurora, Plainfield, Yorkville. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Oswego'), 'solaria laser oswego', 'fractional laser oswego', 'skin resurfacing oswego', 'CO2 laser near me', 'co2 laser $899', 'inmode solaria oswego'],
  alternates: { canonical: `${SITE.url}/co2-laser-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/co2-laser-oswego-il`,
    title: `Solaria CO₂ Laser in Oswego, IL — $899 Full Face | Hello Gorgeous`,
    description: 'The only InMode Solaria CO₂ fractional laser in the Fox Valley. Full face $899 launch special.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

export default function CO2LaserOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
