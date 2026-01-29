import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const teamMembers = [
  {
    name: 'Dr. Amanda Chen',
    title: 'Medical Director',
    bio: 'Board-certified dermatologist with over 15 years of experience in aesthetic medicine.',
    initial: 'AC',
  },
  {
    name: 'Sarah Williams, RN',
    title: 'Lead Aesthetic Nurse',
    bio: 'Specialized in injectable treatments with a passion for natural-looking results.',
    initial: 'SW',
  },
  {
    name: 'Jessica Martinez',
    title: 'Licensed Esthetician',
    bio: 'Expert in advanced skincare treatments and personalized facial protocols.',
    initial: 'JM',
  },
  {
    name: 'Emily Thompson',
    title: 'Patient Coordinator',
    bio: 'Dedicated to ensuring every client has a seamless and welcoming experience.',
    initial: 'ET',
  },
];

const values = [
  {
    icon: '💎',
    title: 'Excellence',
    description: 'We hold ourselves to the highest standards in every treatment and interaction.',
  },
  {
    icon: '💝',
    title: 'Compassion',
    description: 'Your comfort and wellbeing are at the heart of everything we do.',
  },
  {
    icon: '🔬',
    title: 'Innovation',
    description: 'We stay at the forefront of aesthetic medicine with the latest techniques.',
  },
  {
    icon: '🤝',
    title: 'Integrity',
    description: 'Honest recommendations and transparent pricing, always.',
  },
];

const About: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: '60vh' }}>
          <div className="heroContent">
            <p className="heroSubtitle">About Us</p>
            <h1 className="heroTitle">Your Beauty, Our Passion</h1>
            <p className="heroDescription">
              Since 2015, Hello Gorgeous Med Spa has been helping clients discover 
              their most confident, beautiful selves through personalized aesthetic care.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="section sectionLight">
          <div className="aboutPreview">
            <div className="aboutContent">
              <h2>Our Story</h2>
              <p>
                Hello Gorgeous Med Spa was founded with a simple vision: to create a 
                sanctuary where science meets beauty, and every client feels valued 
                and understood.
              </p>
              <p>
                What began as a small practice has grown into a premier destination 
                for aesthetic excellence. Our journey has been driven by a commitment 
                to exceptional results and genuine care for our clients.
              </p>
              <p>
                Today, we&apos;re proud to offer a comprehensive range of treatments in our 
                state-of-the-art facility, combining the latest technology with the 
                timeless art of personalized care.
              </p>
            </div>
            <div className="aboutImage">
              🌟
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section sectionAlt">
          <div className="sectionHeader">
            <p className="sectionSubtitle">Our Values</p>
            <h2 className="sectionTitle">What Guides Us</h2>
            <p className="sectionDescription">
              Our core values shape every aspect of our practice, from the treatments 
              we offer to the way we care for our clients.
            </p>
          </div>
          <div className="servicesGrid">
            {values.map((value, index) => (
              <div key={index} className="serviceCard">
                <div className="serviceIcon">{value.icon}</div>
                <h3 className="serviceTitle">{value.title}</h3>
                <p className="serviceDescription">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="section sectionLight">
          <div className="sectionHeader">
            <p className="sectionSubtitle">Our Team</p>
            <h2 className="sectionTitle">Meet the Experts</h2>
            <p className="sectionDescription">
              Our talented team brings together decades of combined experience 
              in aesthetic medicine, skincare, and patient care.
            </p>
          </div>
          <div className="servicesGrid">
            {teamMembers.map((member, index) => (
              <div key={index} className="serviceCard">
                <div className="serviceIcon" style={{ 
                  background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 600
                }}>
                  {member.initial}
                </div>
                <h3 className="serviceTitle">{member.name}</h3>
                <p style={{ color: '#a855f7', fontWeight: 500, marginBottom: '0.5rem' }}>
                  {member.title}
                </p>
                <p className="serviceDescription">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="ctaSection">
          <div className="ctaContent">
            <h2 className="ctaTitle">Experience the Hello Gorgeous Difference</h2>
            <p className="ctaDescription">
              We&apos;d love to welcome you to our spa. Schedule a consultation 
              to discuss your goals and discover what we can do for you.
            </p>
            <Link href="/contact">
              <button className="ctaButton">Schedule a Consultation</button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
