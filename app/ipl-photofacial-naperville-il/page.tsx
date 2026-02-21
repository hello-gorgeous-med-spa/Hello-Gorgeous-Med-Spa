import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'ipl-photofacial')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `IPL Photofacial Naperville IL | ${service.priceDisplay} | Hello Gorgeous`,
  description: `IPL Photofacial near Naperville, IL. 15 min away. Treat sun damage, age spots, redness & rosacea. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Naperville'),
  alternates: { canonical: `${SITE.url}/ipl-photofacial-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/ipl-photofacial-naperville-il`,
    title: `IPL Photofacial Naperville IL | Hello Gorgeous`,
    description: 'IPL treatment near Naperville, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function IPLNapervillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
