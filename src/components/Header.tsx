import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label="Hello Gorgeous Med Spa home">
            <span className={styles.title}>Hello Gorgeous Med Spa</span>
            <span className={styles.tagline}>Beauty, confidence, and wellness</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary navigation">
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          <Link href="/contact" className={styles.cta}>
            Book a consult
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;