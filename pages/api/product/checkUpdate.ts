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
        await db.connect();
        const products = await Product.find(
            {
                "_id":
                {
                    "$in": req.body.ids
                }
            },
            {
                _id: 1,
                slug: 1,
                price: 1,
                countInStock: 1
            }
        )

        return res.send({ message: 'Successfully finded', data: products });
    } catch (error) {
        return res.status(500).send({ message: 'Error finded', data: [] });
    } finally {
        await db.disconnect();
    }
};

export default handler;