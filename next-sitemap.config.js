module.exports = {
    siteUrl: process.env.NEXTDOMAIN_URL,
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 7000,
    exclude: [
        '/api/*',
        '/admin/*',
        '/documents/*',
    ],
    additionalSitemaps: [
        `${process.env.NEXTDOMAIN_URL}/api/sitemap/sitemap-products`
    ],
};