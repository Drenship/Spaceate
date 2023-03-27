import { NextApiRequest, NextApiResponse } from 'next'

function generateSitemapXml() {
    const baseUrl = 'https://www.example.com' // remplacer par votre URL de base
    const pages = ['/page-1', '/page-2', '/page-3'] // remplacer par une liste des URL de vos pages
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map((page) => `
        <url>
          <loc>${baseUrl}${page}</loc>
        </url>
      `).join('')}
    </urlset>
  `
    return xml
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'text/xml')
    res.write(generateSitemapXml())
    res.end()
}
