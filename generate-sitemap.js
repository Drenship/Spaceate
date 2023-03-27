// generate-sitemap.js

const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

(async () => {
  const pages = [
    '/',
    '/auth/login',
    '/auth/recovery',
    '/auth/register',
    '/cart',
    '/colis',
    '/terms/conditions-generales-d-utilisation',
    '/terms/politique-de-confidentialite',
  ];

  const stream = new SitemapStream({ hostname: 'https://example.com' });

  pages.forEach((page) => {
    stream.write({ url: page, changefreq: 'monthly', priority: 0.7 });
  });

  stream.end();

  const sitemap = await streamToPromise(Readable.from(stream)).then((sm) => sm.toString());

  fs.writeFileSync('public/sitemap.xml', sitemap);
})();
