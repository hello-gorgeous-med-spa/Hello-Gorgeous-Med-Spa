import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'ipl-photofacial')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `IPL Photofacial Aurora IL | ${service.priceDisplay} | Hello Gorgeous`,
  description: `IPL Photofacial near Aurora, IL. 10 min away. Treat sun damage, age spots, redness & rosacea. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Aurora'),
  alternates: { canonical: `${SITE.url}/ipl-photofacial-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/ipl-photofacial-aurora-il`,
    title: `IPL Photofacial Aurora IL | Hello Gorgeous`,
    description: 'IPL treatment near Aurora, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function IPLAuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
