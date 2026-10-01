import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'dermal-fillers')!;
const area = SERVICE_AREAS.find(a => a.slug === 'naperville')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'naperville');

export const metadata: Metadata = {
  title: `Dermal Fillers Naperville IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `Looking for dermal fillers near Naperville, IL? Hello Gorgeous Med Spa is 15 min away. Juvederm, Restylane, cheek & jawline fillers. Licensed NPs. Free consultation!`,
  keywords: generateLocationKeywords(service, 'Naperville'),
  alternates: { canonical: `${SITE.url}/dermal-fillers-naperville-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/dermal-fillers-naperville-il`,
    title: `Dermal Fillers Naperville IL | Hello Gorgeous Med Spa`,
    description: 'Dermal fillers near Naperville, IL. 15 min away. Free consultations.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

const NAPERVILLE_FILLER_FAQS = [
  {
    question: "Who is the best med spa in Naperville, IL for dermal fillers?",
    answer:
      "Hello Gorgeous Med Spa does not have a Naperville office. Naperville patients drive about 15 minutes south on Route 59, or west on Route 34 through Plainfield, to 74 W. Washington Street in downtown Oswego. Licensed nurse practitioners place Juvederm and Restylane in lips, cheeks, and jawline after a medical screening. Book at hellogorgeousmedspa.com/book or call (630) 636-6193.",
  },
  {
    question: "How far is Hello Gorgeous from Naperville for filler?",
    answer:
      "Most Naperville patients reach the Oswego clinic in about 15 minutes via Route 59 south or Route 34 west. The address is 74 W. Washington Street, Oswego, IL 60543.",
  },
];

export default function DermalFillersNapervillePage() {
  return (
    <LocationServicePage
      service={service}
      area={area}
      nearbyAreas={nearbyAreas}
      headline="Dermal fillers for Naperville patients, in downtown Oswego"
      localIntro="Naperville patients who want dermal fillers come to Hello Gorgeous Med Spa at 74 W. Washington Street in downtown Oswego, about 15 minutes south on Route 59 or west on Route 34. We do not have a Naperville office. Licensed nurse practitioners place Juvederm and Restylane in lips, cheeks, and jawline after a medical screening. Call (630) 636-6193 or book at hellogorgeousmedspa.com/book."
      faqs={[...NAPERVILLE_FILLER_FAQS, ...service.faqs]}
    />
  );
}
