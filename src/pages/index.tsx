import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout
      title="Hello Gorgeous Med Spa | Natural-looking results"
      description="A modern med spa experience—injectables, skin, and wellness with personalized treatment plans."
    >
      <section className="hero">
        <div className="container">
          <div className="heroGrid">
            <div>
              <div className="kicker">✨ Personalized plans • Natural-looking results</div>
              <h1 className="headline">Feel confident in your skin—every day.</h1>
              <p className="subhead">
                Hello Gorgeous Med Spa blends evidence-based treatments with a calm, welcoming
                experience. Start with a consult, then choose the services that fit your goals.
              </p>
              <div className="actions">
                <Link className="btn btnPrimary" href="/contact">
                  Book a consult
                </Link>
                <Link className="btn btnSecondary" href="/services">
                  Explore services
                </Link>
              </div>
            </div>

            <div className="surface">
              <div style={{ padding: 18 }}>
                <h2 style={{ fontSize: 18, fontWeight: 900 }}>What to expect</h2>
                <div className="stack" style={{ marginTop: 12 }}>
                  <div className="card">
                    <div className="cardTitle">1) Consultation</div>
                    <div className="cardText">
                      We learn your goals, review history, and map a treatment plan.
                    </div>
                  </div>
                  <div className="card">
                    <div className="cardTitle">2) Treatment</div>
                    <div className="cardText">
                      Comfortable, clinic-grade care with clear aftercare guidance.
                    </div>
                  </div>
                  <div className="card">
                    <div className="cardTitle">3) Follow-up</div>
                    <div className="cardText">
                      We check in, refine the plan, and keep results looking natural.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid3">
            <div className="card">
              <div className="cardTitle">Injectables</div>
              <div className="cardText">
                Subtle enhancements designed to look like you—rested, refreshed, and confident.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Skin & facials</div>
              <div className="cardText">
                Target texture, tone, and glow with results-oriented, relaxing treatments.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Wellness</div>
              <div className="cardText">
                Build consistency with therapies that support energy, recovery, and hydration.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="surface">
            <div style={{ padding: 22 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900 }}>Ready to get started?</h2>
              <p className="subhead" style={{ marginTop: 8 }}>
                Share your goals and we’ll recommend a plan that fits your timeline and comfort.
              </p>
              <div className="actions">
                <Link className="btn btnPrimary" href="/contact">
                  Contact us
                </Link>
                <Link className="btn btnSecondary" href="/about">
                  Learn about our approach
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;