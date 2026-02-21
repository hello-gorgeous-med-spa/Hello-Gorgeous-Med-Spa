// ============================================================
// INDIVIDUAL PROVIDER PROFILE PAGE
// Includes videos, before/after gallery, bio, and booking CTA
// ============================================================

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProviderContent from './ProviderContent';

// Provider data - will be database-driven
const PROVIDERS: Record<string, any> = {
  danielle: {
    id: 'danielle',
    slug: 'danielle',
    name: 'Danielle Glazier-Alcala',
    firstName: 'Danielle',
    credentials: 'FNP-BC',
    title: 'Owner & Lead Aesthetic Injector',
    bio: `Danielle Glazier-Alcala, FNP-BC, is the founder and lead aesthetic injector at Hello Gorgeous Med Spa. With over a decade of nursing experience spanning family medicine, urgent care, and aesthetics, she brings a unique combination of clinical expertise and artistic vision to every treatment.

After years of working in traditional healthcare settings, Danielle recognized a need for a different kind of med spa experience—one that prioritizes patient education, natural-looking results, and personalized care. Hello Gorgeous was born from this vision.

Danielle has completed advanced training in facial anatomy, injection techniques, and the latest aesthetic technologies. She is passionate about staying at the forefront of the industry, regularly attending conferences and advanced training courses to bring the best possible care to her patients.`,
    philosophy: `"Every face tells a story. My goal is to enhance your natural beauty while maintaining the features that make you uniquely you. I believe in conservative, gradual treatments that make you look refreshed, never overdone. Your comfort, safety, and satisfaction are my top priorities."`,
    headshot: '/images/team/danielle-glazier-alcala.jpg',
    specialties: ['Botox & Dysport', 'Lip Augmentation', 'Dermal Fillers', 'CO₂ Laser', 'Hormone Therapy', 'Weight Loss Programs'],
    certifications: [
      'Board Certified Family Nurse Practitioner (FNP-BC)',
      'Allergan Medical Institute Trained',
      'Galderma GAIN Certified',
      'Kybella Certified Provider',
    ],
    color: '#FF2D8E',
    bookingUrl: '/book?provider=danielle',
    phone: '630-636-6193',
    email: 'danielle@hellogorgeousmedspa.com',
  },
  ryan: {
    id: 'ryan',
    slug: 'ryan',
    name: 'Ryan Kent',
    firstName: 'Ryan',
    credentials: 'FNP-C',
    title: 'Aesthetic Injector',
    bio: `Ryan Kent, FNP-C, brings precision and an artistic approach to aesthetic medicine at Hello Gorgeous Med Spa. His background in emergency nursing has given him exceptional assessment skills, a steady hand, and the ability to remain calm and focused during detailed injection procedures.

Ryan's journey to aesthetics came from a deep appreciation for the intersection of science and art. He believes that understanding facial anatomy at a molecular level allows for more precise, natural-looking results. His meticulous approach ensures that every unit of product is placed exactly where it needs to be for optimal outcomes.

Beyond his clinical expertise, Ryan is known for his warm, approachable demeanor. He takes the time to understand each patient's concerns and goals, creating customized treatment plans that address their unique needs.`,
    philosophy: `"I believe aesthetics is both a science and an art. By understanding facial anatomy at a deep level, I can create results that enhance your features while maintaining facial harmony and natural movement. My goal is for you to leave feeling confident and refreshed—like the best version of yourself."`,
    headshot: '/images/team/ryan-kent.jpg',
    specialties: ['Botox & Dysport', 'Jawline Contouring', 'Dermal Fillers', 'PRP Treatments', 'Cheek Enhancement'],
    certifications: [
      'Board Certified Family Nurse Practitioner (FNP-C)',
      'Advanced Injectable Training',
      'PRP Therapy Certified',
      'Facial Anatomy Specialist',
    ],
    color: '#2D63A4',
    bookingUrl: '/book?provider=ryan',
    phone: '630-881-3398',
    email: 'ryan@hellogorgeousmedspa.com',
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(PROVIDERS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const provider = PROVIDERS[slug];
  
  if (!provider) {
    return { title: 'Provider Not Found' };
  }

  return {
    title: `${provider.name}, ${provider.credentials} | Hello Gorgeous Med Spa`,
    description: `Meet ${provider.firstName}, ${provider.title} at Hello Gorgeous Med Spa. Specializing in ${provider.specialties.slice(0, 3).join(', ')}. View results and book your consultation.`,
    openGraph: {
      title: `${provider.name}, ${provider.credentials}`,
      description: `${provider.title} at Hello Gorgeous Med Spa`,
      type: 'profile',
      images: [provider.headshot],
    },
  };
}

export default async function ProviderProfilePage({ params }: Props) {
  const { slug } = await params;
  const provider = PROVIDERS[slug];
  
  if (!provider) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={provider.headshot}
                  alt={`${provider.name}, ${provider.credentials}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                />
              </div>
              {/* Floating badge */}
              <div 
                className="absolute -bottom-4 -right-4 lg:right-8 bg-white rounded-xl shadow-xl p-4"
                style={{ borderLeft: `4px solid ${provider.color}` }}
              >
                <p className="text-sm text-gray-500">Specializing in</p>
                <p className="font-semibold text-gray-900">{provider.specialties[0]}</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <Link 
                href="/providers" 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Providers
              </Link>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {provider.name}
              </h1>
              <p className="text-xl md:text-2xl font-medium mb-2" style={{ color: provider.color }}>
                {provider.credentials}
              </p>
              <p className="text-lg text-gray-600 mb-6">{provider.title}</p>

              {/* Specialties */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {provider.specialties.map((specialty: string) => (
                    <span 
                      key={specialty}
                      className="px-4 py-2 text-sm font-medium rounded-full border"
                      style={{ 
                        borderColor: provider.color,
                        color: provider.color,
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={provider.bookingUrl}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white transition-colors"
                  style={{ backgroundColor: provider.color }}
                >
                  Book with {provider.firstName}
                </Link>
                <a
                  href={`tel:${provider.phone}`}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Call {provider.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client-side interactive content */}
      <ProviderContent provider={provider} />

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: provider.name,
            jobTitle: provider.title,
            description: provider.bio.split('\n\n')[0],
            image: `https://hellogorgeousmedspa.com${provider.headshot}`,
            telephone: provider.phone,
            email: provider.email,
            worksFor: {
              '@type': 'MedicalBusiness',
              name: 'Hello Gorgeous Med Spa',
              url: 'https://hellogorgeousmedspa.com',
            },
            hasCredential: {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: provider.credentials,
            },
            knowsAbout: provider.specialties,
          }),
        }}
      />
    </main>
  );
}
