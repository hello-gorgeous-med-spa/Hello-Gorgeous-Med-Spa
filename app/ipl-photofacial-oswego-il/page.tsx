import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'ipl-photofacial')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `IPL Photofacial Oswego IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `IPL Photofacial in Oswego, IL. Treat sun damage, age spots, redness & rosacea. Intense pulsed light skin rejuvenation. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Oswego'),
  alternates: { canonical: `${SITE.url}/ipl-photofacial-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/ipl-photofacial-oswego-il`,
    title: `IPL Photofacial Oswego IL | Hello Gorgeous`,
    description: 'IPL treatment for sun damage & redness in Oswego, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function IPLOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
