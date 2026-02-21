import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'lip-filler')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `Lip Filler Naperville IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `Looking for lip filler near Naperville, IL? Hello Gorgeous Med Spa is 15 min away. Natural lip enhancement by licensed NPs. Free consultation!`,
  keywords: generateLocationKeywords(service, 'Naperville'),
  alternates: { canonical: `${SITE.url}/lip-filler-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/lip-filler-naperville-il`,
    title: `Lip Filler Naperville IL | Hello Gorgeous Med Spa`,
    description: 'Lip filler near Naperville, IL. 15 min away.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function LipFillerNapervillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
