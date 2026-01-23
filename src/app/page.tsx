import React from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Section from '../components/Section'
import Hero from '../components/Hero'
import HomeInteractive from '../components/home/HomeInteractive'
import ServicesGrid from '../components/ServicesGrid'
import TrustSection from '../components/TrustSection'
import FinancingRewards from '../components/FinancingRewards'
import Testimonials from '../components/Testimonials'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />

      <div className="mt-12">
        <HomeInteractive />
      </div>

      <ServicesGrid />

      <TrustSection />

      <FinancingRewards />

      <Testimonials />

      <CTASection />

      <Footer />

      <Section id="services" className="bg-neutral-50">
        <h3 className="text-2xl font-semibold mb-6">Services Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>Botox</Card>
          <Card>Fillers</Card>
          <Card>Hormone Therapy</Card>
        </div>
      </Section>

      <Section id="trust">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h3 className="text-2xl font-semibold">Trusted care, proven results</h3>
            <p className="text-neutral-600 mt-2">Placeholder for credentials, testimonials, and before/after gallery.</p>
          </div>
          <div>
            <Card>
              <h4 className="font-medium">Contact & Booking</h4>
              <p className="text-neutral-600 mt-2">Lead capture placeholder</p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  )
}
