import { NextApiRequest, NextApiResponse } from 'next';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return handlePostRequest(req, res);
        default:
            return res.status(400).send({ message: 'Method not allowed' });
    }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const query = req.body.query;
        const regex = new RegExp(`^${query.split('').join('.*')}$`, 'i');
        const regex2 = `\^${query}\i`;
        await db.connect();
        const products = await Product.find({
            $or: [
                { name: query },
                { name: { $regex: query, $options: "i" } },
                { name: { $regex: regex } },
                { name: { $regex: regex2 } }
            ]
        }, {
            _id: 1,
            main_image: 1,
            name: 1,
            slug: 1,
        }).limit(7)
        return res.send({ message: 'Successfully finded', data: products });
    } catch (error) {
        return res.status(500).send({ message: 'Une erreur est survenue' });
    } finally {
        await db.disconnect();
    }
};

export default handler;