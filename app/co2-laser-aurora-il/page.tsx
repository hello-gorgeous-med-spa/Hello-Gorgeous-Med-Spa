import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'co2-laser')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `CO₂ Laser near Aurora, IL — $899 Full Face | Hello Gorgeous Med Spa`,
  description: `Solaria CO₂ fractional laser 10 minutes from Aurora, IL — $899 full face launch special. The only InMode Solaria in the Fox Valley. Wrinkles, acne scars, sun damage. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Aurora'), 'solaria laser aurora', 'fractional laser aurora', 'CO2 laser near me', 'co2 laser aurora', 'inmode solaria aurora'],
  alternates: { canonical: `${SITE.url}/co2-laser-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/co2-laser-aurora-il`,
    title: `Solaria CO₂ Laser near Aurora, IL — $899 Full Face | Hello Gorgeous`,
    description: 'The only InMode Solaria CO₂ in the Fox Valley — 10 min from Aurora. $899 full face launch special.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

export default function CO2LaserAuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
