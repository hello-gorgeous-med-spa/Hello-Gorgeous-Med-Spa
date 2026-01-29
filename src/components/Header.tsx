import React from 'react';
import Link from 'next/link';
import { FiHome, FiUsers, FiCalendar, FiMail } from 'react-icons/fi';

const Header: React.FC = () => {
    return (
        <header className="bg-black border-b border-white/10 px-4 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-bold px-2 py-1 rounded">
                        HG
                    </span>
                    <span className="text-white font-bold text-lg hidden sm:block">
                        Hello Gorgeous Med Spa
                    </span>
                </Link>
                
                <nav className="flex items-center gap-1 sm:gap-2">
                    <Link 
                        href="/" 
                        className="flex items-center gap-1.5 text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                    >
                        <FiHome className="w-4 h-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                    <Link 
                        href="/care-team" 
                        className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                    >
                        <FiUsers className="w-4 h-4" />
                        <span className="hidden sm:inline">Meet Your Care Team</span>
                    </Link>
                    <Link 
                        href="/contact" 
                        className="flex items-center gap-1.5 text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm"
                    >
                        <FiMail className="w-4 h-4" />
                        <span className="hidden sm:inline">Contact</span>
                    </Link>
                    <Link 
                        href="/book" 
                        className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-pink-700 transition text-sm font-semibold ml-2"
                    >
                        <FiCalendar className="w-4 h-4" />
                        <span>Book Now</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
