import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'co2-laser')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `CO₂ Fractional Laser Aurora IL | InMode Solaria | Hello Gorgeous`,
  description: `CO₂ Fractional Laser near Aurora, IL. 10 min away. InMode Solaria for wrinkles, acne scars, skin resurfacing. Book consultation!`,
  keywords: [...generateLocationKeywords(service, 'Aurora'), 'solaria laser aurora', 'fractional laser aurora'],
  alternates: { canonical: `${SITE.url}/co2-laser-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/co2-laser-aurora-il`,
    title: `CO₂ Fractional Laser Aurora IL | Hello Gorgeous`,
    description: 'CO₂ laser skin resurfacing near Aurora, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function CO2LaserAuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
