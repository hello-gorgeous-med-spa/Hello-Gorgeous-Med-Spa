import React from 'react'
import services from '../../../data/services.json'
import { Metadata } from 'next'
import { generateServiceMetadata } from '@/lib/seo'

type Service = {
  slug: string
  title: string
  excerpt: string
  content: string
  seo?: { title?: string; description?: string }
  faq?: Array<{ q: string; a: string }>
}

export async function generateStaticParams() {
  return services.map((s: Service) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const svc = (services as Service[]).find(s => s.slug === params.slug)
  if (!svc) return {}
  return generateServiceMetadata({
    title: svc.seo?.title || svc.title,
    description: svc.seo?.description || svc.excerpt,
    pathname: `/services/${svc.slug}`,
  })
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const svc = (services as Service[]).find(s => s.slug === params.slug)
  if (!svc) return <div>Service not found</div>

  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{svc.title}</h1>
      <p className="text-gray-600 mb-6">{svc.excerpt}</p>
      <section className="prose max-w-none">
        <p>{svc.content}</p>
      </section>

      {svc.faq && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
          <dl className="space-y-4">
            {svc.faq.map((f, i) => (
              <div key={i}>
                <dt className="font-medium">{f.q}</dt>
                <dd className="text-gray-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  )
}
