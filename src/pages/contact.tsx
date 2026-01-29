import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: '50vh' }}>
          <div className="heroContent">
            <p className="heroSubtitle">Contact Us</p>
            <h1 className="heroTitle">Let&apos;s Connect</h1>
            <p className="heroDescription">
              Ready to begin your journey? We&apos;re here to answer your questions 
              and help you schedule your appointment.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="section sectionLight">
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '4rem',
          }}>
            {/* Contact Form */}
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a1a2e' }}>
                Send Us a Message
              </h2>
              
              {submitted ? (
                <div style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                  borderRadius: '20px',
                  padding: '3rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
                  <h3 style={{ fontSize: '1.5rem', color: '#1a1a2e', marginBottom: '1rem' }}>
                    Thank You!
                  </h3>
                  <p style={{ color: '#6b6b7b' }}>
                    We&apos;ve received your message and will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label 
                      htmlFor="name"
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: 500,
                        color: '#4a4a5a'
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '2px solid #e9d5ff',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="email"
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: 500,
                        color: '#4a4a5a'
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '2px solid #e9d5ff',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="phone"
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: 500,
                        color: '#4a4a5a'
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '2px solid #e9d5ff',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="service"
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: 500,
                        color: '#4a4a5a'
                      }}
                    >
                      Service of Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '2px solid #e9d5ff',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">Select a service...</option>
                      <option value="botox">Botox & Fillers</option>
                      <option value="laser">Laser Treatments</option>
                      <option value="facial">Facial Rejuvenation</option>
                      <option value="body">Body Contouring</option>
                      <option value="consultation">General Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label 
                      htmlFor="message"
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: 500,
                        color: '#4a4a5a'
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '2px solid #e9d5ff',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                      placeholder="Tell us about your goals or any questions you have..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btnPrimary"
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a1a2e' }}>
                Contact Information
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="serviceCard" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="serviceIcon" style={{ 
                      width: '50px', 
                      height: '50px', 
                      fontSize: '1.2rem',
                      flexShrink: 0 
                    }}>
                      📍
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                        Our Location
                      </h3>
                      <p style={{ color: '#6b6b7b', margin: 0, lineHeight: 1.6 }}>
                        123 Beauty Lane<br />
                        Beverly Hills, CA 90210
                      </p>
                    </div>
                  </div>
                </div>

                <div className="serviceCard" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="serviceIcon" style={{ 
                      width: '50px', 
                      height: '50px', 
                      fontSize: '1.2rem',
                      flexShrink: 0 
                    }}>
                      📞
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                        Phone
                      </h3>
                      <p style={{ color: '#6b6b7b', margin: 0 }}>
                        (555) 123-4567
                      </p>
                    </div>
                  </div>
                </div>

                <div className="serviceCard" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="serviceIcon" style={{ 
                      width: '50px', 
                      height: '50px', 
                      fontSize: '1.2rem',
                      flexShrink: 0 
                    }}>
                      ✉️
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                        Email
                      </h3>
                      <p style={{ color: '#6b6b7b', margin: 0 }}>
                        hello@hellogorgeousmedspa.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="serviceCard" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="serviceIcon" style={{ 
                      width: '50px', 
                      height: '50px', 
                      fontSize: '1.2rem',
                      flexShrink: 0 
                    }}>
                      🕐
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                        Hours
                      </h3>
                      <p style={{ color: '#6b6b7b', margin: 0, lineHeight: 1.8 }}>
                        Monday - Friday: 9am - 7pm<br />
                        Saturday: 10am - 5pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
