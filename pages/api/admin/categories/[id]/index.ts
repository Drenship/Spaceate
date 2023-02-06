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
        if (req.method === 'GET') {
            return getHandler(req, res);
        } else if (req.method === 'PUT') {
            return putHandler(req, res);
        } if (req.method === 'DELETE') {
            return deleteHandler(req, res);
        } else {
            return res.status(400).send({ message: 'Method not allowed' });
        }
    })
}

// update new Categorie
const putHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    const categorieData = req.body

    if (categorieData.name.length < 1) return res.status(400).send({ message: 'Name empty' });
    if (categorieData.slug.length < 1) return res.status(400).send({ message: 'Slug empty' });

    await db.connect();
    const newCategorie = new Categorie({
        name: categorieData.name,
        slug: categorieData.slug
    });

    const categorie = await newCategorie.save();
    await db.disconnect();
    res.send({ message: 'categorie created successfully', categorie });
};


const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    await Categorie.deleteOne({ _id: req.query.id });
    await db.disconnect();
    res.send({ success: true, message: "Successfully deleted" });
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.connect();
        const categorie = await Categorie.findById(req.query.id);
        await db.disconnect();
        res.send(categorie);
    } catch (error) {
        res.status(500).send(error);
    }
};

export default handler;