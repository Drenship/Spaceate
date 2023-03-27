import { NextApiRequest, NextApiResponse } from 'next';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.connect();
        const products = await Product.find({}, { slug: 1 })
        await db.disconnect();
        console.log(products)
        res.send({ products: products });
    } catch (error) {
        res.send({ products: [] });
    }
};

export default handler;