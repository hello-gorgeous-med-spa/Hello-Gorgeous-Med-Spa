import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/services', label: 'Services' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.inner}>
                    <Link href="/" className={styles.logo}>
                        <div>
                            <h1 className={styles.title}>Hello Gorgeous</h1>
                            <p className={styles.subtitle}>Med Spa</p>
                        </div>
                    </Link>

                    <nav className={styles.nav}>
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className={styles.navLink}>
                                {link.label}
                            </Link>
                        ))}
                        <Link href="/contact" className={styles.ctaButton}>
                            Book Now
                        </Link>
                    </nav>

                    <button
                        className={styles.mobileMenuButton}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <nav className={styles.mobileNav}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={styles.mobileNavLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="px-4 pt-2">
                        <Link href="/contact" className="btn-primary w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
                            Book Now
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;
