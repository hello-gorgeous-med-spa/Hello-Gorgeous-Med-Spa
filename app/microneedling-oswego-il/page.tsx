import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { SERVICE_AREAS, getServiceBySlug, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = getServiceBySlug('microneedling') ?? getServiceBySlug('morpheus8')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `RF Microneedling Oswego IL | ${service?.priceDisplay ?? 'From $800'} | Hello Gorgeous Med Spa`,
  description: `RF Microneedling in Oswego, IL. Reduce wrinkles, acne scars & pores. Radiofrequency microneedling for skin tightening. Book your consultation!`,
  keywords: service ? generateLocationKeywords(service, 'Oswego') : ['rf microneedling', 'oswego il', 'morpheus8'],
  alternates: { canonical: `${SITE.url}/microneedling-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/microneedling-oswego-il`,
    title: `RF Microneedling Oswego IL | Hello Gorgeous Med Spa`,
    description: 'RF Microneedling in Oswego, IL. Skin tightening & rejuvenation.',
    images: service?.heroImage ? [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }] : undefined,
  },
};

export default function MicroneedlingOswegoPage() {
  return <LocationServicePage service={service!} area={area} nearbyAreas={nearbyAreas} />;
}
