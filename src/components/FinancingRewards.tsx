import React from 'react'

export default function FinancingRewards() {
  return (
    <section className="ds-container py-16">
      <h2 className="text-2xl font-heading mb-4">Payments & Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="p-4 bg-white border rounded flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center">Cherry</div>
          <div>
            <div className="font-semibold">Cherry Payment Plans</div>
            <div className="text-sm text-neutral-600">Flexible payment options for qualifying clients.</div>
          </div>
        </div>

        <div className="p-4 bg-white border rounded flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center">Allē</div>
          <div>
            <div className="font-semibold">Allē Rewards</div>
            <div className="text-sm text-neutral-600">Earn points on eligible treatments and products.</div>
          </div>
        </div>

        <div className="p-4 bg-white border rounded flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center">Evolus</div>
          <div>
            <div className="font-semibold">Rewards</div>
            <div className="text-sm text-neutral-600">Partner rewards and manufacturer programs.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
