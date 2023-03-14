import type { NextApiRequest, NextApiResponse } from 'next/types'
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import { TypeCategorie } from '@libs/typings';
import db from '@libs/database/dbConnect';
import Categorie from '@libs/models/Categorie';

type ErrorMessage = {
    message: string
}

type CreateCategorieProps = {
    message: string,
    categorie: TypeCategorie
}

const handler = async (req: NextApiRequest, res: NextApiResponse<TypeCategorie | TypeCategorie[] | ErrorMessage | CreateCategorieProps>) => {
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
}

// update new Categorie
const handlePutRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const categorieData = req.body

        if (categorieData.name.length < 1) return res.status(400).send({ message: 'Name empty' });
        if (categorieData.slug.length < 1) return res.status(400).send({ message: 'Slug empty' });

        await db.connect();
        const updateResult = await Categorie.findOneAndUpdate({ _id: req.query.id }, {
            $set: {
                name: categorieData.name,
                slug: categorieData.slug
            }
        }, { new: true });
        await db.disconnect();
        res.send({ message: 'categorie created successfully', data: updateResult });
    } catch (error) {
        await db.disconnect();
        res.status(500).send({ message: 'An error has occurred' });
    }
};

const handleDeleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.connect();
        await Categorie.deleteOne({ _id: req.query.id });
        await db.disconnect();
        res.send({ success: true, message: "Successfully deleted" });
    } catch (error) {
        await db.disconnect();
        res.status(500).send({ message: 'An error has occurred' });
    }
};

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.connect();
        const categorie = await Categorie.findById(req.query.id);
        await db.disconnect();
        res.send(categorie);
    } catch (error) {
        res.status(500).send({ message: 'An error has occurred' });
    }
};

export default handler;