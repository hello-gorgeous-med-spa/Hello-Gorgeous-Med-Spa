import React from 'react';
import Layout from '../components/Layout';

const ServicesPage: React.FC = () => {
  return (
    <Layout
      title="Services | Hello Gorgeous Med Spa"
      description="Explore our services: injectables, skin and facials, body treatments, and wellness support."
    >
      <header className="pageHeader">
        <div className="container">
          <h1 className="pageTitle">Services</h1>
          <p className="pageLead">
            Choose from results-focused treatments designed around your goals. Not sure where to
            start? Book a consult and we’ll guide you.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="grid3">
            <div className="card">
              <div className="cardTitle">Injectables</div>
              <div className="cardText">
                Softening lines, restoring balance, and enhancing features with a natural finish.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Skin & facials</div>
              <div className="cardText">
                Hydration, brightening, and texture support with customized facial plans.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Body treatments</div>
              <div className="cardText">
                Targeted options for toning, smoothing, and improving overall skin appearance.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Laser & hair reduction</div>
              <div className="cardText">
                Reduce unwanted hair and support smoother skin with a consistent treatment series.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Wellness support</div>
              <div className="cardText">
                Options that support hydration and recovery as part of a broader wellness plan.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Consultations</div>
              <div className="cardText">
                Your first step: goals, timeline, expectations, and a plan you feel good about.
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
