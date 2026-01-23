import React from 'react'
import Section from '../../components/Section'
import Card from '../../components/Card'

export default function AboutPage() {
  return (
    <Section id="about">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold">About Hello Gorgeous Med Spa</h1>
          <p className="text-neutral-600 mt-4">Placeholder: mission, team, credentials, and clinic information. Designed for trust and clarity.</p>
        </div>

        <div>
          <Card>
            <h3 className="font-medium">Our Providers</h3>
            <p className="text-neutral-600 mt-2">Provider bios and credentials will appear here.</p>
          </Card>
        </div>
      </div>
    </Section>
  )
}
