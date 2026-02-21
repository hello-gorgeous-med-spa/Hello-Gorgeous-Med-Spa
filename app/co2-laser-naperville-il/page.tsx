import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'co2-laser')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `CO₂ Fractional Laser Naperville IL | InMode Solaria | Hello Gorgeous`,
  description: `CO₂ Fractional Laser near Naperville, IL. 15 min away. InMode Solaria for wrinkles, acne scars, skin resurfacing. Book consultation!`,
  keywords: [...generateLocationKeywords(service, 'Naperville'), 'solaria laser naperville', 'fractional laser naperville'],
  alternates: { canonical: `${SITE.url}/co2-laser-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/co2-laser-naperville-il`,
    title: `CO₂ Fractional Laser Naperville IL | Hello Gorgeous`,
    description: 'CO₂ laser skin resurfacing near Naperville, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function CO2LaserNapervillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
