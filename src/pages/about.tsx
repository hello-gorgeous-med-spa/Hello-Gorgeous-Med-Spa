import React from 'react';
import Layout from '../components/Layout';

const AboutPage: React.FC = () => {
  return (
    <Layout
      title="About | Hello Gorgeous Med Spa"
      description="Learn about our approach: personalized plans, natural-looking results, and a calm, welcoming experience."
    >
      <header className="pageHeader">
        <div className="container">
          <h1 className="pageTitle">About</h1>
          <p className="pageLead">
            We’re here for results that still look like you. Every plan starts with listening and
            ends with a confident, natural finish.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="grid3">
            <div className="card">
              <div className="cardTitle">Personalized care</div>
              <div className="cardText">
                We tailor treatments to your goals, schedule, and comfort level—no one-size-fits-all
                packages.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Natural-looking results</div>
              <div className="cardText">
                The best outcome is subtle: refreshed, balanced, and aligned with your features.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Transparent guidance</div>
              <div className="cardText">
                Clear expectations, aftercare you can follow, and ongoing check-ins to keep you on
                track.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="surface">
            <div style={{ padding: 22 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900 }}>Our philosophy</h2>
              <p className="subhead" style={{ marginTop: 10, maxWidth: '75ch' }}>
                Great aesthetics should feel collaborative and empowering. We focus on enhancing
                what’s already working—so you leave feeling like yourself, just a bit more
                radiant.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
