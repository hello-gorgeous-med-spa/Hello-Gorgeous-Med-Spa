import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <h1 className={styles.title}>Hello Gorgeous Med Spa</h1>
                </Link>
                <nav className={styles.nav}>
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
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
                <Link href="/contact">
                    <button className={styles.bookButton}>Book Now</button>
                </Link>
            </div>
        </header>
    );
};

export default Header;