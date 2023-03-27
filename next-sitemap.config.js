const fetch = require('isomorphic-unfetch');

async function fetchProducts() {
    // Remplacez cette URL par l'URL de votre API pour récupérer les produits
    const res = await fetch('https://spaceate.vercel.app/api/product/sitemap');
    const products = await res.json();
    return products;
}

async function getProductUrls() {
    const products = await fetchProducts();
    return products.map((product) => ({
        loc: `https://spaceate.vercel.app/${product.slug}`, // Remplacez par le format d'URL de vos produits
        changefreq: 'daily',
        priority: 0.7,
    }));
}

module.exports = async () => {
    const productUrls = await getProductUrls();

    return {
        siteUrl: 'https://spaceate.vercel.app',
        generateRobotsTxt: true,
        exclude: [
            '/api/*',
            '/admin/*',
            '/documents/*',
        ],
        robotsTxtOptions: {
            additionalSitemaps: [
                "https://spaceate.vercel.app/sitemap-products"
            ]
        },
        sitemapSize: 5000,
        additionalSitemap: [
            {
                baseUrl: 'https://spaceate.vercel.app',
                pages: productUrls,
                sitemap: 'sitemap-products',
            },
        ],
        transform: (config, url) => {
            return {
                loc: `${config.siteUrl}${url}`, // Ajoutez l'URL du site ici
                changefreq: config.changefreq,
                priority: config.priority,
                lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
                alternateRefs: config.alternateRefs,
            };
        },
    };
};
