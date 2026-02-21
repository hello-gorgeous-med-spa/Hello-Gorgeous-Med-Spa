import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'weight-loss')!;
const area = SERVICE_AREAS.find(a => a.slug === 'aurora')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'aurora');

export const metadata: Metadata = {
  title: `Medical Weight Loss Aurora IL | Semaglutide & Tirzepatide | Hello Gorgeous`,
  description: `Medical weight loss near Aurora, IL. Semaglutide (Ozempic/Wegovy) & Tirzepatide (Mounjaro) available. 10 min from Aurora. Book consultation!`,
  keywords: [...generateLocationKeywords(service, 'Aurora'), 'ozempic aurora', 'wegovy aurora', 'mounjaro aurora'],
  alternates: { canonical: `${SITE.url}/weight-loss-aurora-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/weight-loss-aurora-il`,
    title: `Medical Weight Loss Aurora IL | Hello Gorgeous`,
    description: 'Semaglutide & Tirzepatide near Aurora, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function WeightLossAuroraPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
