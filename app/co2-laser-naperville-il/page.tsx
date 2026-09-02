import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'co2-laser')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `CO₂ Laser near Naperville, IL — $799 Face Neck Chin | Hello Gorgeous Med Spa`,
  description: `InMode Solaria CO₂ 15 minutes from Naperville, IL — September sale: face, neck & chin $799, neck/chin/chest $400, under eyes $299. Wrinkles, acne scars, sun damage. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Naperville'), 'solaria laser naperville', 'fractional laser naperville', 'CO2 laser near me', 'co2 laser naperville', 'inmode solaria naperville'],
  alternates: { canonical: `${SITE.url}/co2-laser-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/co2-laser-naperville-il`,
    title: `Solaria CO₂ Laser near Naperville, IL — $799 September | Hello Gorgeous`,
    description: 'InMode Solaria CO₂ in Oswego — 15 min from Naperville. September: $799 / $400 / $299.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

export default function CO2LaserNapervillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
