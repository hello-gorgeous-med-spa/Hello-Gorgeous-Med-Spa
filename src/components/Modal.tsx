"use client"
import React from 'react'

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-md max-w-2xl w-full p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close modal" className="text-neutral-500">✕</button>
        </div>
        <div className="mt-4 text-neutral-700">{children}</div>
      </div>
    </div>
  )
}
