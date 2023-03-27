const fetch = require('isomorphic-unfetch');

async function fetchProducts() {
    // Remplacez cette URL par l'URL de votre API pour récupérer les produits
    //const res = await fetch('https://spaceate.vercel.app/api/product/sitemap');
    //const products = await res.json();
    //return products;
    return [
        {
            "slug": "makima"
        },
        {
            "slug": "mashle"
        },
        {
            "slug": "ftx-exchange-usdt-long-bot-2"
        },
        {
            "slug": "fisher"
        },
        {
            "slug": "avatar-2"
        },
        {
            "slug": "fraise"
        },
        {
            "slug": "stange-fish"
        },
        {
            "slug": "trader"
        },
        {
            "slug": "lotus"
        }
    ]
}

async function getProductUrls() {
    const products = await fetchProducts();
    return products.map((product) => ({
        loc: `https://spaceate.vercel.app/product/${product.slug}`, // Remplacez par le format d'URL de vos produits
        changefreq: 'daily',
        priority: 0.7,
    }));
}


async function fetchData() {
    const productUrls = await getProductUrls();

    return {
        siteUrl: '',
        generateRobotsTxt: true,
        sitemapSize: 7000,
        exclude: [
            '/api/*',
            '/admin/*',
            '/documents/*',
        ],
        robotsTxtOptions: {
            additionalSitemap: [
                {
                    baseUrl: '',
                    pages: productUrls,
                    sitemap: 'sitemap-products',
                },
            ],
        },
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
}

module.exports = fetchData;