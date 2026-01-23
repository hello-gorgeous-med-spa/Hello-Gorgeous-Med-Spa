import React from 'react'
import Section from '../../components/Section'
import ContactForm from '../../components/ContactForm'

export default function ContactPage() {
  return (
    <Section id="contact">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-heading font-semibold">Contact & Book Now</h1>
        <p className="text-neutral-600 mt-3">Use the form to send a message or request booking information.</p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </div>
    </Section>
  )
}
