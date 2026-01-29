import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const serviceCategories = [
  {
    category: 'Injectables',
    icon: '💉',
    services: [
      {
        name: 'Botox',
        description: 'Smooth fine lines and wrinkles with our premium neurotoxin treatments. Results last 3-4 months.',
        duration: '15-30 min',
        startingPrice: '$12/unit',
      },
      {
        name: 'Dermal Fillers',
        description: 'Restore volume and enhance facial contours with hyaluronic acid fillers for natural-looking results.',
        duration: '30-60 min',
        startingPrice: '$650/syringe',
      },
      {
        name: 'Lip Enhancement',
        description: 'Achieve fuller, more defined lips with our expert lip filler techniques.',
        duration: '30 min',
        startingPrice: '$550',
      },
      {
        name: 'Kybella',
        description: 'Permanently reduce double chin fat with this FDA-approved injectable treatment.',
        duration: '30 min',
        startingPrice: '$1,200/session',
      },
    ],
  },
  {
    category: 'Laser Treatments',
    icon: '✨',
    services: [
      {
        name: 'Laser Hair Removal',
        description: 'Achieve smooth, hair-free skin with our advanced laser technology. Safe for all skin types.',
        duration: '15-60 min',
        startingPrice: '$150/session',
      },
      {
        name: 'IPL Photofacial',
        description: 'Reduce sun damage, redness, and uneven skin tone with intense pulsed light therapy.',
        duration: '30-45 min',
        startingPrice: '$350/session',
      },
      {
        name: 'Laser Skin Resurfacing',
        description: 'Improve skin texture, reduce scarring, and promote collagen production.',
        duration: '45-60 min',
        startingPrice: '$800/session',
      },
      {
        name: 'Tattoo Removal',
        description: 'Safely remove unwanted tattoos with our state-of-the-art laser technology.',
        duration: '15-45 min',
        startingPrice: '$200/session',
      },
    ],
  },
  {
    category: 'Facial Treatments',
    icon: '🌸',
    services: [
      {
        name: 'Signature Facial',
        description: 'A customized facial treatment tailored to your unique skin concerns and goals.',
        duration: '60 min',
        startingPrice: '$150',
      },
      {
        name: 'Chemical Peels',
        description: 'Reveal fresh, radiant skin with our professional-grade chemical peel treatments.',
        duration: '30-45 min',
        startingPrice: '$175',
      },
      {
        name: 'Microneedling',
        description: 'Stimulate collagen production and improve skin texture with controlled micro-injuries.',
        duration: '60 min',
        startingPrice: '$350',
      },
      {
        name: 'HydraFacial',
        description: 'Deep cleanse, exfoliate, and hydrate your skin with this multi-step treatment.',
        duration: '45 min',
        startingPrice: '$225',
      },
    ],
  },
  {
    category: 'Body Treatments',
    icon: '💫',
    services: [
      {
        name: 'CoolSculpting',
        description: 'Freeze away stubborn fat with this non-invasive body contouring treatment.',
        duration: '35-60 min',
        startingPrice: '$750/area',
      },
      {
        name: 'Skin Tightening',
        description: 'Firm and tighten loose skin with radiofrequency technology.',
        duration: '30-60 min',
        startingPrice: '$400/area',
      },
      {
        name: 'Cellulite Treatment',
        description: 'Reduce the appearance of cellulite with our advanced treatment protocols.',
        duration: '45 min',
        startingPrice: '$350/session',
      },
      {
        name: 'IV Therapy',
        description: 'Boost your wellness with customized vitamin and hydration infusions.',
        duration: '30-45 min',
        startingPrice: '$175',
      },
    ],
  },
];

const Services: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: '60vh' }}>
          <div className="heroContent">
            <p className="heroSubtitle">Our Services</p>
            <h1 className="heroTitle">Transformative Treatments</h1>
            <p className="heroDescription">
              From subtle enhancements to comprehensive rejuvenation, we offer 
              a full spectrum of aesthetic treatments tailored to your unique goals.
            </p>
          </div>
        </section>

        {/* Services Sections */}
        {serviceCategories.map((category, categoryIndex) => (
          <section 
            key={categoryIndex} 
            className={`section ${categoryIndex % 2 === 0 ? 'sectionLight' : 'sectionAlt'}`}
          >
            <div className="sectionHeader">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.icon}</div>
              <h2 className="sectionTitle">{category.category}</h2>
            </div>
            <div className="servicesGrid">
              {category.services.map((service, serviceIndex) => (
                <div key={serviceIndex} className="serviceCard">
                  <h3 className="serviceTitle">{service.name}</h3>
                  <p className="serviceDescription" style={{ marginBottom: '1.5rem' }}>
                    {service.description}
                  </p>
                  <div style={{ 
                    borderTop: '1px solid #e9d5ff', 
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: '#6b6b7b' }}>
                      ⏱ {service.duration}
                    </span>
                    <span style={{ color: '#a855f7', fontWeight: 600 }}>
                      From {service.startingPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Consultation CTA */}
        <section className="ctaSection">
          <div className="ctaContent">
            <h2 className="ctaTitle">Not Sure Where to Start?</h2>
            <p className="ctaDescription">
              Book a complimentary consultation with our experts. We&apos;ll create a 
              personalized treatment plan tailored to your unique goals and concerns.
            </p>
            <Link href="/contact">
              <button className="ctaButton">Book Free Consultation</button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
