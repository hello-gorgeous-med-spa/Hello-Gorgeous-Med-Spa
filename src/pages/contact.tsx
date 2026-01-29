import React from 'react';
import Layout from '../components/Layout';

const ContactPage: React.FC = () => {
  return (
    <Layout
      title="Contact | Hello Gorgeous Med Spa"
      description="Contact Hello Gorgeous Med Spa to book a consultation, ask a question, or learn which services fit your goals."
    >
      <header className="pageHeader">
        <div className="container">
          <h1 className="pageTitle">Contact</h1>
          <p className="pageLead">
            Tell us what you’re looking for and we’ll help you choose the best next step. For
            fastest response, include your availability.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="heroGrid">
            <div className="surface">
              <div style={{ padding: 22 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900 }}>Send a message</h2>
                <p className="subhead" style={{ marginTop: 8 }}>
                  This form is a placeholder (no backend yet). For now, use the email link on the
                  right.
                </p>

                <form className="stack" style={{ marginTop: 14 }}>
                  <div className="formGrid">
                    <label>
                      Name
                      <input type="text" name="name" placeholder="Your name" />
                    </label>
                    <label>
                      Email
                      <input type="email" name="email" placeholder="you@example.com" />
                    </label>
                  </div>
                  <label>
                    What are you interested in?
                    <input type="text" name="interest" placeholder="Consult, injectables, skin, wellness..." />
                  </label>
                  <label>
                    Message
                    <textarea name="message" placeholder="Share your goals and availability..." />
                  </label>
                  <button type="button" className="btn btnPrimary">
                    Submit (coming soon)
                  </button>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="cardTitle">Reach us directly</div>
              <div className="cardText" style={{ marginTop: 10 }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:hello@hellogorgeousmedspa.com">hello@hellogorgeousmedspa.com</a>
                  </div>
                  <div>
                    <strong>Phone:</strong> <a href="tel:+15555551234">(555) 555-1234</a>
                  </div>
                  <div>
                    <strong>Hours:</strong> Mon–Sat, 9am–6pm
                  </div>
                  <div>
                    <strong>Location:</strong> 123 Main St, Your City, ST
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14 }} className="kicker">
                Tip: Book a consult if you’re unsure where to start.
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
