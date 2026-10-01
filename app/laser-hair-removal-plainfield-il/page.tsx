import { Metadata } from 'next';
import { LocationServicePage } from '@/components/LocationServicePage';
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from '@/lib/location-seo';
import { SITE } from '@/lib/seo';

const service = TOP_SERVICES.find(s => s.slug === 'laser-hair-removal')!;
const area = SERVICE_AREAS.find(a => a.slug === 'plainfield')!;
const nearbyAreas = SERVICE_AREAS.filter(a => a.slug !== 'plainfield');

export const metadata: Metadata = {
  title: `Laser Hair Removal Plainfield IL | ${service.priceDisplay} | Hello Gorgeous`,
  description: `Laser hair removal near Plainfield, IL. 12 min away. Bikini, underarms, legs, face & body. Professional laser treatment. Memberships from $69/month. Book consultation!`,
  keywords: generateLocationKeywords(service, 'Plainfield'),
  alternates: { canonical: `${SITE.url}/laser-hair-removal-plainfield-il` },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/laser-hair-removal-plainfield-il`,
    title: `Laser Hair Removal Plainfield IL | Hello Gorgeous`,
    description: 'Laser hair removal near Plainfield, IL. Memberships from $69/month.',
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

const PLAINFIELD_LASER_FAQS = [
  {
    question: "Where is the best laser hair removal in Plainfield, IL?",
    answer:
      "Hello Gorgeous Med Spa does not have a Plainfield office. Plainfield patients drive about 12–15 minutes east on Route 126 to Route 34, into downtown Oswego, at 74 W. Washington Street. Laser hair removal covers face, underarms, bikini, legs, and body. A consult confirms candidacy before a series is booked. Call (630) 636-6193 or book at hellogorgeousmedspa.com/book.",
  },
  {
    question: "How far is laser hair removal from Plainfield?",
    answer:
      "Central Plainfield to the Oswego clinic is typically 12–15 minutes via Route 126 east to Route 34. The address is 74 W. Washington Street, Oswego, IL 60543.",
  },
];

export default function LaserHairRemovalPlainfieldPage() {
  return (
    <LocationServicePage
      service={service}
      area={area}
      nearbyAreas={nearbyAreas}
      headline="Laser hair removal for Plainfield patients, in downtown Oswego"
      localIntro="Plainfield patients who want laser hair removal come to Hello Gorgeous Med Spa at 74 W. Washington Street in downtown Oswego, about 12–15 minutes east on Route 126 to Route 34. We do not have a Plainfield office. Treatment areas include face, underarms, bikini, legs, and body. A consult confirms whether laser hair removal is appropriate before a series is booked. Call (630) 636-6193 or book at hellogorgeousmedspa.com/book."
      faqs={[...PLAINFIELD_LASER_FAQS, ...service.faqs]}
    />
  );
}
