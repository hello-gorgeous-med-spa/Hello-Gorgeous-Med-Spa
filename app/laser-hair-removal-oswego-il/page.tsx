import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'laser-hair-removal')!;
const area = SERVICE_AREAS.find(a => a.slug === 'oswego')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'oswego');

export const metadata: Metadata = {
  title: `Laser Hair Removal Oswego IL | ${service.priceDisplay} | Hello Gorgeous Med Spa`,
  description: `Laser hair removal in Oswego, IL. Permanent hair reduction for bikini, underarms, legs, face & body. Professional laser treatment. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Oswego'),
  alternates: { canonical: `${SITE.url}/laser-hair-removal-oswego-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/laser-hair-removal-oswego-il`,
    title: `Laser Hair Removal Oswego IL | Hello Gorgeous`,
    description: 'Laser hair removal in Oswego, IL. All body areas.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

const OSWEGO_LASER_FAQS = [
  {
    question: "Where is the best laser hair removal in Oswego, IL?",
    answer:
      "Hello Gorgeous Med Spa offers laser hair removal at 74 W. Washington Street in downtown Oswego, IL 60543. Treatment areas include face, underarms, bikini, legs, and body. A consult confirms candidacy before a series is booked. Call (630) 636-6193 or book at hellogorgeousmedspa.com/book.",
  },
];

export default function LaserHairRemovalOswegoPage() {
  return (
    <LocationServicePage
      service={service}
      area={area}
      nearbyAreas={nearbyAreas}
      headline="Laser hair removal in downtown Oswego"
      localIntro="Hello Gorgeous Med Spa offers laser hair removal at 74 W. Washington Street in downtown Oswego, by the Fox River. Treatment areas include face, underarms, bikini, legs, and body. A consult confirms whether you are a candidate before a series is booked. Patients also come from Montgomery, Yorkville, Plainfield, Aurora, and Naperville. Call (630) 636-6193 or book at hellogorgeousmedspa.com/book."
      faqs={[...OSWEGO_LASER_FAQS, ...service.faqs]}
    />
  );
}
