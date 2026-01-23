"use client"
import React, { useState } from 'react'
import Modal from './Modal'
import data from '../data/interactive-content.json'

export default function ServicesGrid() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section id="services" className="ds-container py-16">
      <h2 className="text-3xl font-heading mb-6">Our Core Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.serviceCategories.map(s => (
          <button key={s.id} onClick={() => setOpenId(s.id)} className="text-left p-6 border rounded-lg bg-white hover:shadow-lg transition">
            <div className="font-semibold text-lg">{s.title}</div>
            <div className="text-sm text-neutral-600 mt-2">{s.short}</div>
            <div className="mt-4 h-1 bg-pink-500 w-16" />
          </button>
        ))}
      </div>

      {openId && (
        <Modal open={!!openId} onClose={() => setOpenId(null)} title={data.serviceCategories.find(s => s.id === openId)?.title}>
          <p className="mb-3">Quick overview copy for {data.serviceCategories.find(s => s.id === openId)?.title}.</p>
          <ul className="list-disc pl-5 text-sm text-neutral-700">
            <li>What it is</li>
            <li>Who it’s for</li>
            <li>What to expect</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="/contact" className="bg-brand text-white px-4 py-2 rounded">Book</a>
            <a href="#" className="text-neutral-700 underline">Learn more</a>
          </div>
        </Modal>
      )}
    </section>
  )
}
