import React from 'react'

const reviews = [
  { id: 1, name: 'A.R.', quote: 'Absolutely thrilled with my results — professional and caring team.' },
  { id: 2, name: 'M.T.', quote: 'Clean, modern clinic and excellent follow-up.' },
  { id: 3, name: 'S.L.', quote: 'Worth every penny. Natural-looking fillers.' }
]

export default function Testimonials() {
  return (
    <section className="bg-black text-white py-16">
      <div className="ds-container">
        <h2 className="text-2xl font-heading mb-6">What clients say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map(r => (
            <div key={r.id} className="p-6 bg-neutral-900 rounded">
              <div className="text-lg">"{r.quote}"</div>
              <div className="mt-4 text-sm text-pink-400">— {r.name}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <a href="/reviews" className="text-pink-400 underline">Read more reviews</a>
        </div>
      </div>
    </section>
  )
}
