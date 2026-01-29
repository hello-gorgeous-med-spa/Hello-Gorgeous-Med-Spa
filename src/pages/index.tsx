import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const services = [
  {
    icon: '💉',
    title: 'Botox & Fillers',
    description: 'Smooth fine lines and restore youthful volume with our premium injectable treatments administered by expert practitioners.',
  },
  {
    icon: '✨',
    title: 'Laser Treatments',
    description: 'Advanced laser technology for skin resurfacing, hair removal, and pigmentation correction for flawless skin.',
  },
  {
    icon: '🌸',
    title: 'Facial Rejuvenation',
    description: 'Customized facials and skin treatments designed to restore radiance and address your unique skin concerns.',
  },
  {
    icon: '💫',
    title: 'Body Contouring',
    description: 'Non-invasive body sculpting treatments to help you achieve your desired silhouette with no downtime.',
  },
];

const testimonials = [
  {
    text: 'The team at Hello Gorgeous transformed my skin! I\'ve never felt more confident. The results exceeded my expectations.',
    name: 'Sarah M.',
    title: 'Botox & Facial Client',
    initial: 'S',
  },
  {
    text: 'Professional, welcoming, and incredibly skilled. Every visit feels like a luxury spa experience. Highly recommend!',
    name: 'Jennifer L.',
    title: 'Laser Treatment Client',
    initial: 'J',
  },
  {
    text: 'After just a few sessions, I noticed a dramatic improvement. The staff truly cares about your results and comfort.',
    name: 'Michelle K.',
    title: 'Body Contouring Client',
    initial: 'M',
  },
];

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="heroContent">
            <p className="heroSubtitle">Welcome to Hello Gorgeous</p>
            <h1 className="heroTitle">Discover Your Most Beautiful Self</h1>
            <p className="heroDescription">
              Experience luxury aesthetic treatments in a warm, welcoming environment. 
              Our expert team is dedicated to helping you look and feel your absolute best.
            </p>
            <div className="heroButtons">
              <Link href="/contact">
                <button className="btnPrimary">Book Consultation</button>
              </Link>
              <Link href="/services">
                <button className="btnSecondary">Explore Services</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section sectionAlt">
          <div className="sectionHeader">
            <p className="sectionSubtitle">Our Services</p>
            <h2 className="sectionTitle">Treatments Tailored for You</h2>
            <p className="sectionDescription">
              From subtle enhancements to transformative treatments, we offer a comprehensive 
              range of services to help you achieve your aesthetic goals.
            </p>
          </div>
          <div className="servicesGrid">
            {services.map((service, index) => (
              <div key={index} className="serviceCard">
                <div className="serviceIcon">{service.icon}</div>
                <h3 className="serviceTitle">{service.title}</h3>
                <p className="serviceDescription">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Preview Section */}
        <section className="section sectionLight">
          <div className="aboutPreview">
            <div className="aboutImage">
              🏥
            </div>
            <div className="aboutContent">
              <h2>Where Beauty Meets Expertise</h2>
              <p>
                At Hello Gorgeous Med Spa, we believe everyone deserves to feel confident 
                and beautiful in their own skin. Our state-of-the-art facility combines 
                cutting-edge technology with personalized care.
              </p>
              <p>
                Our team of licensed professionals brings years of experience and a 
                genuine passion for helping clients achieve their aesthetic goals.
              </p>
              <div className="aboutFeatures">
                <div className="feature">
                  <div className="featureIcon">✓</div>
                  <span className="featureText">Board-Certified Practitioners</span>
                </div>
                <div className="feature">
                  <div className="featureIcon">✓</div>
                  <span className="featureText">Advanced Technology & Techniques</span>
                </div>
                <div className="feature">
                  <div className="featureIcon">✓</div>
                  <span className="featureText">Personalized Treatment Plans</span>
                </div>
                <div className="feature">
                  <div className="featureIcon">✓</div>
                  <span className="featureText">Comfortable, Luxurious Environment</span>
                </div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <Link href="/about">
                  <button className="btnPrimary">Learn More About Us</button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section sectionDark">
          <div className="sectionHeader">
            <p className="sectionSubtitle" style={{ color: '#d4a5ff' }}>Testimonials</p>
            <h2 className="sectionTitle">What Our Clients Say</h2>
            <p className="sectionDescription">
              Don&apos;t just take our word for it—hear from our amazing clients who have 
              experienced the Hello Gorgeous difference.
            </p>
          </div>
          <div className="testimonialGrid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonialCard">
                <p className="testimonialText">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="testimonialAuthor">
                  <div className="authorAvatar">{testimonial.initial}</div>
                  <div className="authorInfo">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="ctaSection">
          <div className="ctaContent">
            <h2 className="ctaTitle">Ready to Begin Your Transformation?</h2>
            <p className="ctaDescription">
              Schedule your complimentary consultation today and take the first step 
              toward looking and feeling your best.
            </p>
            <Link href="/contact">
              <button className="ctaButton">Book Your Free Consultation</button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;