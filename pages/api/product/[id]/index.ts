import { NextApiRequest, NextApiResponse } from 'next';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    await db.disconnect();
    res.send(product);
};