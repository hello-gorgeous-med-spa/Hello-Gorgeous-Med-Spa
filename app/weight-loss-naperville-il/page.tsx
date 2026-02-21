import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'weight-loss')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `Medical Weight Loss Naperville IL | Semaglutide & Tirzepatide | Hello Gorgeous`,
  description: `Medical weight loss near Naperville, IL. Semaglutide (Ozempic/Wegovy) & Tirzepatide (Mounjaro) available. 15 min from Naperville. Book consultation!`,
  keywords: [...generateLocationKeywords(service, 'Naperville'), 'ozempic naperville', 'wegovy naperville', 'mounjaro naperville'],
  alternates: { canonical: `${SITE.url}/weight-loss-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/weight-loss-naperville-il`,
    title: `Medical Weight Loss Naperville IL | Hello Gorgeous`,
    description: 'Semaglutide & Tirzepatide near Naperville, IL.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function WeightLossNapervillePage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
