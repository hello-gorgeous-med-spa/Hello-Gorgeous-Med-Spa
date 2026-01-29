import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.brand}>Hello Gorgeous Med Spa</div>
            <div className={styles.small}>
              Modern aesthetics with a warm, clinical-standard experience.
            </div>
          </div>

          <nav aria-label="Footer" className={styles.nav}>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>

        <div className={styles.bottom}>
          <div className={styles.small}>© {year} Hello Gorgeous Med Spa. All rights reserved.</div>
          <div className={styles.small}>
            Information on this site is for general education only and is not medical advice.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
