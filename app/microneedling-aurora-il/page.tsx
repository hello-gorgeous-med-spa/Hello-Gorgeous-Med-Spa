import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, getServiceBySlug, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = getServiceBySlug('microneedling') ?? getServiceBySlug('morpheus8')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `RF Microneedling Aurora IL | ${service?.priceDisplay ?? 'From $800'} | Hello Gorgeous Med Spa`,
  description: `RF Microneedling near Aurora, IL. 10 min away. Reduce wrinkles, acne scars & pores. Radiofrequency microneedling. Book consultation!`,
  keywords: service ? generateLocationKeywords(service, 'Aurora') : ['rf microneedling', 'aurora il', 'morpheus8'],
  alternates: { canonical: `${SITE.url}/microneedling-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/microneedling-aurora-il`,
    title: `RF Microneedling Aurora IL | Hello Gorgeous`,
    description: 'RF Microneedling near Aurora, IL.',
    images: service?.heroImage ? [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }] : undefined,
  },
};

export default function MicroneedlingAuroraPage() {
  return <LocationServicePage service={service!} area={area} nearbyAreas={nearbyAreas} />;
}
