import React from 'react'

export default function CTASection() {
  return (
    <section className="py-12 bg-pink-500 text-white">
      <div className="ds-container flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-heading">Ready to get started?</h3>
          <p className="text-sm">Book your consultation and discover the best plan for your goals.</p>
        </div>
        <div>
          <a href="/contact" className="inline-block bg-white text-pink-500 px-6 py-3 rounded-md font-semibold">Book Your Consultation</a>
        </div>
      </div>
    </section>
  )
}
