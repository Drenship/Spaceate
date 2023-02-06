import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import Product from '@libs/models/Product';
import db from '@libs/database/dbConnect';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: true, adminOnly: true })(req, res, () => {

        if (req.method === 'GET') {
            return getHandler(req, res);
        } else if (req.method === 'POST') {
            return postHandler(req, res);
        } else {
            return res.status(400).send({ message: 'Method not allowed' });
        }
    })
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const newProduct = new Product({
        name: 'sample name',
        slug: 'sample-name-' + Math.random(),
        image: '/images/shirt1.jpg',
        price: 0,
        category: 'sample category',
        brand: 'sample brand',
        countInStock: 0,
        description: 'sample description',
        rating: 0,
        numReviews: 0,
    });

    const product = await newProduct.save();
    await db.disconnect();
    res.send({ message: 'Product created successfully', product });
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
};

export default handler;
