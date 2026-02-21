import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'lip-filler')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `Lip Filler Oswego IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `Looking for lip filler in Oswego, IL? Hello Gorgeous Med Spa offers natural-looking lip enhancement. Licensed nurse practitioners. Book your free consultation!`,
  keywords: generateLocationKeywords(service, 'Oswego'),
  alternates: { canonical: `${SITE.url}/lip-filler-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/lip-filler-oswego-il`,
    title: `Lip Filler Oswego IL | Hello Gorgeous Med Spa`,
    description: 'Natural lip filler in Oswego, IL. Free consultations.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function LipFillerOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
