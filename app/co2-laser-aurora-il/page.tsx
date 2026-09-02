import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'co2-laser')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `CO₂ Laser near Aurora, IL — $799 Face Neck Chin | Hello Gorgeous Med Spa`,
  description: `InMode Solaria CO₂ 10 minutes from Aurora, IL — September sale: face, neck & chin $799, neck/chin/chest $400, under eyes $299. Wrinkles, acne scars, sun damage. Free consultation.`,
  keywords: [...generateLocationKeywords(service, 'Aurora'), 'solaria laser aurora', 'fractional laser aurora', 'CO2 laser near me', 'co2 laser aurora', 'inmode solaria aurora'],
  alternates: { canonical: `${SITE.url}/co2-laser-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/co2-laser-aurora-il`,
    title: `Solaria CO₂ Laser near Aurora, IL — $799 September | Hello Gorgeous`,
    description: 'InMode Solaria CO₂ in Oswego — 10 min from Aurora. September: $799 / $400 / $299.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

export default function CO2LaserAuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
