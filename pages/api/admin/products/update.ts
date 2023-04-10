import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import Product from '@libs/models/Product';
import db from '@libs/database/dbConnect';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: true, adminOnly: true })(req, res, () => {
        switch (req.method) {
            case 'POST':
                return handlePostRequest(req, res);
            default:
                return res.status(400).send({ message: 'Method not allowed' });
        }
    })
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.body.updateType) {
        case 'PUT_PROMOTION':
            return PUT_PROMOTION(req, res);

        default:
            return res.status(405).send({ message: 'La méthode d\'envoi n\'est pas autorisée' });
    }
};

const PUT_PROMOTION = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { data } = req.body;

        await db.connect();

        await Product.updateMany()

        const updatedProducts = await Product.updateMany(
            { _id: { $in: data.productIds } },
            {
                $push: {
                    promotions: data.promotion
                }
            }
        );

        console.log('Produits mis à jour :', updatedProducts);

        await db.disconnect();
        return res.send({ success: true, message: 'Produits mis à jour avec succès' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Une erreur s'est produite" });
    }
};

export default handler;
