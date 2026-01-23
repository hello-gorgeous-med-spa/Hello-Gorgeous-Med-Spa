import React from 'react'

export default function TrustSection() {
  return (
    <section className="bg-white text-black py-16">
      <div className="ds-container">
        <h2 className="text-2xl font-heading mb-4">Medically Supervised, Safety-First</h2>
        <p className="text-neutral-700 max-w-2xl">All treatments are overseen by licensed medical professionals. We prioritize safety, evidence-based protocols, and transparent patient education.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded">
            <h4 className="font-semibold">Licensed Providers</h4>
            <p className="text-sm text-neutral-600 mt-1">Experienced clinicians and nurse injectors.</p>
          </div>
          <div className="p-4 border rounded">
            <h4 className="font-semibold">Clinical Protocols</h4>
            <p className="text-sm text-neutral-600 mt-1">Evidence-based safety and aftercare plans.</p>
          </div>
          <div className="p-4 border rounded">
            <h4 className="font-semibold">Transparent Pricing</h4>
            <p className="text-sm text-neutral-600 mt-1">Clear costs and financing options available.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
