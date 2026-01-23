import React from 'react'

export default function ContactForm() {
  return (
    <form className="max-w-xl space-y-4" action="#" method="post">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input name="name" required className="mt-1 block w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" type="email" required className="mt-1 block w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea name="message" rows={4} required className="mt-1 block w-full border rounded px-3 py-2" />
      </div>

      <div>
        <button type="submit" className="bg-black text-white px-5 py-2 rounded">Send</button>
      </div>
    </form>
  )
}
