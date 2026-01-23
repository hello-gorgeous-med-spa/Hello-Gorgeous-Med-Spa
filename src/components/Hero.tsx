"use client"
import React from 'react'
import Button from './Button'

export default function Hero() {
  return (
    <section aria-label="Hero" className="bg-black text-white">
      <div className="ds-container py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold leading-tight">Luxury aesthetics. Medical expertise. Real results.</h1>
            <p className="mt-4 text-lg max-w-xl text-neutral-300">Premium, clinically supervised treatments designed to deliver visible, natural-looking results.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/contact" className="inline-block bg-brand text-white px-6 py-3 rounded-md font-semibold">Book Now</a>
              <a href="#services" className="inline-block border border-white text-white px-6 py-3 rounded-md">Explore Services</a>
            </div>
          </div>

          <div className="mt-8 lg:mt-0">
            <div className="w-full h-64 bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-800">Hero image placeholder</div>
          </div>
        </div>
      </div>
    </section>
  )
}
