import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h3 className={styles.footerTitle}>Hello Gorgeous Med Spa</h3>
                    <p className={styles.footerDescription}>
                        Your destination for beauty, wellness, and rejuvenation. 
                        Experience the transformation you deserve.
                    </p>
                </div>
                
                <div className={styles.footerSection}>
                    <h4 className={styles.sectionTitle}>Quick Links</h4>
                    <ul className={styles.footerLinks}>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/services">Services</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>
                
                <div className={styles.footerSection}>
                    <h4 className={styles.sectionTitle}>Services</h4>
                    <ul className={styles.footerLinks}>
                        <li><Link href="/services">Botox & Fillers</Link></li>
                        <li><Link href="/services">Laser Treatments</Link></li>
                        <li><Link href="/services">Facial Rejuvenation</Link></li>
                        <li><Link href="/services">Body Contouring</Link></li>
                    </ul>
                </div>
                
                <div className={styles.footerSection}>
                    <h4 className={styles.sectionTitle}>Contact Us</h4>
                    <div className={styles.contactInfo}>
                        <p>123 Beauty Lane</p>
                        <p>Beverly Hills, CA 90210</p>
                        <p>Phone: (555) 123-4567</p>
                        <p>Email: hello@hellogorgeousmedspa.com</p>
                    </div>
                </div>
            </div>
            
            <div className={styles.footerBottom}>
                <p>&copy; {new Date().getFullYear()} Hello Gorgeous Med Spa. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
