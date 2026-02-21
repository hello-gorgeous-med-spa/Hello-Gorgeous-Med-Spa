import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'microneedling')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `RF Microneedling Naperville IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `RF Microneedling near Naperville, IL. 15 min away. Reduce wrinkles, acne scars & pores. Radiofrequency microneedling. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Naperville'),
  alternates: { canonical: `${SITE.url}/microneedling-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/microneedling-naperville-il`,
    title: `RF Microneedling Naperville IL | Hello Gorgeous`,
    description: 'RF Microneedling near Naperville, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function MicroneedlingNapervillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
