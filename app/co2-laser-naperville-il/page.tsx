import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'co2-laser')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `CO₂ Laser near Naperville, IL — $899 Full Face | Hello Gorgeous Med Spa`,
  description: `InMode Solaria CO₂ fractional laser 15 minutes from Naperville, IL — $899 full face launch special (typically $1,500+ at plastic surgery offices). Wrinkles, acne scars, sun damage. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Naperville'), 'solaria laser naperville', 'fractional laser naperville', 'CO2 laser near me', 'co2 laser naperville', 'inmode solaria naperville'],
  alternates: { canonical: `${SITE.url}/co2-laser-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/co2-laser-naperville-il`,
    title: `Solaria CO₂ Laser near Naperville, IL — $899 Full Face | Hello Gorgeous`,
    description: 'InMode Solaria CO₂ in Oswego — just 15 min from Naperville. $899 full face launch special.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

export default function CO2LaserNapervillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
