module.exports = {
    siteUrl: 'https://spaceate.vercel.app/', // Remplacez par l'URL de votre site
    generateRobotsTxt: true, // (optionnel)
    exclude: ['/api/*'], // Exclure les fichiers API ou autres fichiers que vous ne souhaitez pas inclure dans le sitemap
    robotsTxtOptions: {
        additionalSitemaps: [
            //'https://spaceate.vercel.app/sitemap.xml', // Remplacez par l'URL de votre sitemap
        ],
    },
};
