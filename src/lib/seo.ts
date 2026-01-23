export function absoluteUrl(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://hellogorgeousmedspa.com'
  return new URL(path, base).toString()
}

export function generateServiceMetadata({ title, description, pathname }: { title: string; description?: string; pathname?: string }) {
  const url = absoluteUrl(pathname)
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Hello Gorgeous Med Spa',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Hello Gorgeous Med Spa",
    "url": absoluteUrl('/'),
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Oswego",
      "addressRegion": "IL",
      "addressCountry": "US"
    }
  }
}
