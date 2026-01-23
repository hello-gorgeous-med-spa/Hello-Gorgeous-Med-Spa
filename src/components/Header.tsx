"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Button from './Button'

export default function Header() {
    const [open, setOpen] = useState(false)

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-black text-white">
            <div className="ds-container flex items-center justify-between py-3">
                <Link href="/" className="flex items-center gap-3" aria-label="Hello Gorgeous Home">
                    <div className="w-10 h-10 rounded-sm bg-white text-black flex items-center justify-center font-bold">HG</div>
                    <span className="text-base md:text-lg font-heading">Hello Gorgeous</span>
                </Link>

                <nav aria-label="Primary navigation" className="hidden md:block">
                    <ul className="flex items-center gap-8 text-sm">
                        <li><Link href="/services" className="hover:text-pink-500">Services</Link></li>
                        <li><Link href="/about" className="hover:text-pink-500">About</Link></li>
                        <li><Link href="/specials" className="hover:text-pink-500">Specials</Link></li>
                        <li><Link href="/reviews" className="hover:text-pink-500">Reviews</Link></li>
                        <li><Link href="/contact" className="hover:text-pink-500">Contact</Link></li>
                    </ul>
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/contact" className="hidden md:inline-block">
                        <Button>{'Book Now'}</Button>
                    </Link>

                    <button aria-label="Open menu" onClick={() => setOpen(true)} className="md:hidden p-2">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                </div>
            </div>

            {/* Mobile full-screen menu */}
            {open && (
                <div className="fixed inset-0 bg-black text-white flex flex-col p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-sm bg-white text-black flex items-center justify-center font-bold">HG</div>
                            <span className="font-heading">Hello Gorgeous</span>
                        </div>
                        <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        </button>
                    </div>

                    <nav className="flex-1">
                        <ul className="flex flex-col gap-6 text-lg">
                            <li><Link href="/services" onClick={() => setOpen(false)} className="hover:text-pink-400">Services</Link></li>
                            <li><Link href="/about" onClick={() => setOpen(false)} className="hover:text-pink-400">About</Link></li>
                            <li><Link href="/specials" onClick={() => setOpen(false)} className="hover:text-pink-400">Specials</Link></li>
                            <li><Link href="/reviews" onClick={() => setOpen(false)} className="hover:text-pink-400">Reviews</Link></li>
                            <li><Link href="/contact" onClick={() => setOpen(false)} className="hover:text-pink-400">Contact</Link></li>
                        </ul>
                    </nav>

                    <div className="mt-6">
                        <Link href="/contact" onClick={() => setOpen(false)}>
                            <button className="w-full bg-brand text-white py-3 rounded-md">Book Now</button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}