import { NextApiRequest, NextApiResponse } from 'next';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return handlePostRequest(req, res);
        case 'GET':
            return handlePostRequest(req, res);
        default:
            return res.status(400).send({ message: 'Method not allowed' });
    }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        await db.connect();

        const results = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories', // Remplacez par le nom de votre collection de catégories
                    localField: 'categorie', // Remplacez par le nom de champ qui fait référence à la catégorie dans votre modèle de produit
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: '$category', // "Dérouler" le tableau des catégories pour accéder aux sous-catégories
            },
            {
                $group: {
                    _id: '$category',
                    items: {
                        $push: '$$ROOT', // Ajouter l'objet du produit complet au groupe
                    },
                },
            },
            {
                $project: {
                    categorie: '$_id',
                    items: {
                        $slice: ['$items', 20],
                    },
                },
            },
        ]);

        console.log('success', results)
        return res.send({ message: 'Successfully finded', data: results });
    } catch (err) {
        console.log('err', err)
        return res.send({ message: 'error finded', data: [] });
    } finally {
        await db.disconnect();
    }
}

export default handler;