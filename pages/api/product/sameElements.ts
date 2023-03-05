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
        const { categorie, subCategorie, initialProductID } = req.body;

        await db.connect();
        const products = await Product.find({
            _id: { $ne: initialProductID },
            $or: [
                { categorie: categorie },
                { subCategorie: subCategorie },
            ]
        }, {
            _id: 1,
            main_image: 1,
            name: 1,
            slug: 1,
            price: 1,
            price_in: 1,
            rating: 1,
            numReviews: 1
        })
        await db.disconnect();
        console.log(products)
        res.send({ message: 'Successfully finded', data: products });
    } catch (error) {

    }
};

export default handler;