import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="bg-white border-b">
            <div className="container flex items-center justify-between py-6">
                <h1 className="text-xl font-semibold">Hello Gorgeous Med Spa</h1>
                <nav>
                    <ul className="flex gap-6 text-sm">
                        <li>
                            <Link href="/" className="hover:underline">Home</Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:underline">About</Link>
                        </li>
                        <li>
                            <Link href="/services" className="hover:underline">Services</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:underline">Contact</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;