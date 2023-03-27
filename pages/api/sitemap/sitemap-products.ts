import { NextApiRequest, NextApiResponse } from 'next';
import { createSitemap } from 'sitemap';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.connect();
        const products = await Product.find({}, { _id: 0, slug: 1 })

        const urls = products.map((product) => ({
            url: `/product/${product.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
        }));

        const sitemap = createSitemap({
            hostname: process.env.NEXTDOMAIN_URL,
            cacheTime: 600000,
            urls,
        });

        res.setHeader('Content-Type', 'application/xml');
        res.write(sitemap.toString());
        res.end();
    } catch (error) {
        res.status(500).send('Erreur lors de la génération du sitemap');
    } finally {
        await db.disconnect();
    }
};

export default handler;