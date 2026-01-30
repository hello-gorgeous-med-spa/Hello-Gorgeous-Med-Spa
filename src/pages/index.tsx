import React from 'react';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to Hello Gorgeous Med Spa</h1>
        <p>Your journey to beauty and wellness starts here.</p>
        
        <div style={{ marginTop: '40px' }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          >
            <source src="/mascots/peppi.mp4" type="video/mp4" />
          </video>
        </div>
      </main>
    </div>
  );
};

export default Home;