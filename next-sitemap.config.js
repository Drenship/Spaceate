module.exports = {
    siteUrl: process.env.NEXTDOMAIN_URL || "https://example.com",
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
        `${process.env.NEXTDOMAIN_URL || "https://example.com"}/api/sitemap/sitemap-products`
    ],
    robotsTxtOptions: {
        additionalSitemaps: [
            `${process.env.NEXTDOMAIN_URL || "https://example.com"}/api/sitemap/sitemap-products`,
        ],
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/admin/", "/documents/"],
                sitemap: `${process.env.NEXTDOMAIN_URL || "https://example.com"}/sitemap.xml`,
            },
        ],
    },
};
