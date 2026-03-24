import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'lip-filler')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `Lip Filler Near Me | Aurora IL | ${service.priceDisplay} — Hello Gorgeous Med Spa`,
  description: `Lip filler near me in Aurora, IL? Hello Gorgeous is 10 min away. Natural results, licensed NPs. Free consultation. Serving Aurora, North Aurora, Montgomery.`,
  keywords: [...generateLocationKeywords(service, 'Aurora'), 'lip filler near me aurora'],
  alternates: { canonical: `${SITE.url}/lip-filler-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/lip-filler-aurora-il`,
    title: `Lip Filler Aurora IL | Hello Gorgeous Med Spa`,
    description: 'Lip filler near Aurora, IL. 10 min away.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function LipFillerAuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
