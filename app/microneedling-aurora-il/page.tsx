import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'microneedling')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `RF Microneedling Aurora IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `RF Microneedling near Aurora, IL. 10 min away. Reduce wrinkles, acne scars & pores. Radiofrequency microneedling. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Aurora'),
  alternates: { canonical: `${SITE.url}/microneedling-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/microneedling-aurora-il`,
    title: `RF Microneedling Aurora IL | Hello Gorgeous`,
    description: 'RF Microneedling near Aurora, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function MicroneedlingAuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
