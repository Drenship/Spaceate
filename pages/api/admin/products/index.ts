import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import Product from '@libs/models/Product';
import db from '@libs/database/dbConnect';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: true, adminOnly: true })(req, res, () => {
        switch (req.method) {
            case 'GET':
                return handleGetRequest(req, res);
            case 'POST':
                return handlePostRequest(req, res);
            default:
                return res.status(400).send({ message: 'Method not allowed' });
        }
    })
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const productData = req.body

        await db.connect();
        const newProduct = new Product({
            name:  productData.name,
            slug:  productData.slug,
            main_image: productData.main_image,
            images: productData.images,
            description: productData.description,
            
            categorie: productData.categorie,
            subCategorie: productData.subCategorie,

            price: productData.price,
            price_in: productData.price_in,
            countInStock: productData.countInStock,
            advancePrice: {
                initialCost: productData.initialCost,
                tva: productData.tva,
                marge: productData.marge,
            },

            isFeatured: productData.isFeatured,
            isPublished: productData.isPublished
        });

        const product = await newProduct.save();
        console.log(product)
        await db.disconnect();
        res.send({ message: 'Product created successfully', data: product });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'An error has occurred' });
    }
};

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.connect();
        const products = await Product.find({});
        await db.disconnect();
        res.send({ data: products });
    } catch (error) {
        res.status(500).send({ message: 'An error has occurred' });
    }
};

export default handler;
