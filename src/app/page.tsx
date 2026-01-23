import React from 'react'

export default function Home() {
  return (
    <section>
      <div className="py-12">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">Modern medical aesthetics, thoughtful care.</h2>
          <p className="text-lg text-gray-600 mb-6">Welcome to Hello Gorgeous Med Spa — a foundation for a fast, SEO-friendly Next.js site.</p>
          <div className="flex gap-4">
            <a href="/contact" className="bg-black text-white px-5 py-3 rounded-md">Book Now</a>
            <a href="/services" className="border border-gray-300 px-5 py-3 rounded-md">Learn More</a>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Services Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded">Botox</div>
          <div className="p-6 border rounded">Fillers</div>
          <div className="p-6 border rounded">Hormone Therapy</div>
        </div>
      </div>
    </section>
  )
}
