import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="ds-container grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold">Hello Gorgeous Med Spa</div>
          <div className="text-sm text-neutral-400 mt-2">74 W Washington St, Oswego, IL</div>
          <div className="text-sm text-neutral-400">Hours: Tue-Fri 9am–6pm</div>
        </div>

        <div>
          <div className="font-semibold">Navigate</div>
          <ul className="mt-2 text-sm text-neutral-400 space-y-1">
            <li>Services</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Connect</div>
          <div className="text-sm text-neutral-400 mt-2">(555) 555-5555</div>
          <div className="text-sm text-neutral-400">hello@hellogorgeousspa.com</div>
        </div>
      </div>
    </footer>
  )
}
