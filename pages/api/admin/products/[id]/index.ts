import type { NextApiRequest, NextApiResponse } from 'next/types'
import Product from '@libs/models/Product';
import db from '@libs/database/dbConnect';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';

type ErrorMessage = {
    message: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ErrorMessage>) => {
    authSessionMiddleware({ authOnly: true, adminOnly: true })(req, res, () => {
        switch (req.method) {
            case 'GET':
                return handleGetRequest(req, res);
            case 'PUT':
                return handlePutRequest(req, res);
            case 'DELETE':
                return handleDeleteRequest(req, res);
            default:
                return res.status(400).send({ message: 'Method not allowed' });
        }
    })
};

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    await db.disconnect();
    res.send(product);
};

const handlePutRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const updateProductData = req.body

        await db.connect();
        const product = await Product.findById(req.query.id);
        if (product) {
            product.name = updateProductData.name;
            product.slug = updateProductData.slug;
            product.main_image = updateProductData.main_image;
            product.images = updateProductData.images;
            product.description = updateProductData.description;

            product.categorie = updateProductData.categorie;
            product.subCategorie = updateProductData.subCategorie;

            product.price = updateProductData.price;
            product.price_in = updateProductData.price_in;
            product.countInStock = updateProductData.countInStock;
            product.advancePrice = {
                initialCost: updateProductData.initialCost,
                tva: updateProductData.tva,
                marge: updateProductData.marge,
            };

            product.isFeatured = updateProductData.isFeatured;
            product.isPublished = updateProductData.isPublished;


            const updateResult = await product.save();
            await db.disconnect();
            res.send({ message: 'Product updated successfully', data: updateResult });
        } else {
            await db.disconnect();
            res.status(404).send({ message: 'Product not found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'An error has occurred' });
    }
};

const handleDeleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.connect();
        const product = await Product.findById(req.query.id);
        if (product) {
            await product.remove();
            await db.disconnect();
            res.send({ success: true, message: 'Product deleted successfully' });
        } else {
            await db.disconnect();
            res.status(404).send({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'An error has occurred', error: error});
    }
};

export default handler;
