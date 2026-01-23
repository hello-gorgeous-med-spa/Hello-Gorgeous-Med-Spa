import services from '../../../data/services.json'

function urlEntry(loc: string, priority = 0.8, changefreq = 'weekly') {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://hellogorgeousmedspa.com'

  const urls = [
    urlEntry(`${base}/`, 1.0, 'daily'),
    urlEntry(`${base}/services`, 0.9, 'weekly'),
    urlEntry(`${base}/about`, 0.6, 'monthly'),
    urlEntry(`${base}/contact`, 0.6, 'monthly'),
  ]

  for (const s of services) {
    urls.push(urlEntry(`${base}/services/${s.slug}`, 0.8, 'weekly'))
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
