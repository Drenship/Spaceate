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
    data: TypeCategorie
}

const handler = async (req: NextApiRequest, res: NextApiResponse<TypeCategorie | TypeCategorie[] | ErrorMessage | CreateCategorieProps>) => {
    authSessionMiddleware({ authOnly: true, adminOnly: true })(req, res, () => {
        switch (req.method) {
            case 'POST':
                return handlePostRequest(req, res);
            case 'PUT':
                return handlePutRequest(req, res);
            case 'DELETE':
                return handleDeleteRequest(req, res);
            default:
                return res.status(400).send({ message: 'Method not allowed' });
        }
    })
}

// create
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const categorieData = req.body

        if (categorieData.name.length < 1) return res.status(400).send({ message: 'Name empty' });
        if (categorieData.slug.length < 1) return res.status(400).send({ message: 'Slug empty' });

        await db.connect();
        const updateResult = await Categorie.findOneAndUpdate({ _id: req.query.id }, {
            $push: {
                subCategories: {
                    name: categorieData.name,
                    slug: categorieData.slug
                }
            }
        }, { new: true });
        await db.disconnect();
        res.send({ message: 'Subcategory created successfully', data: updateResult });
    } catch (error) {
        await db.disconnect();
        res.status(500).send({ message: 'An error has occurred' });
    }
};

// update
const handlePutRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const categorieData = req.body
        console.log(categorieData)

        if (categorieData.name.length < 1) return res.status(400).send({ message: 'Name empty' });
        if (categorieData.slug.length < 1) return res.status(400).send({ message: 'Slug empty' });

        await db.connect();
        const getCategorie = await Categorie.findById(req.query.id)
        if (!getCategorie) return res.send({ message: 'Document do not exist' });
        getCategorie.subCategories.id(req.query.subid).name = categorieData.name;
        getCategorie.subCategories.id(req.query.subid).slug = categorieData.slug;
        getCategorie.markModified('subCategories');
        const updateResult = await getCategorie.save()
        await db.disconnect();

        res.send({ message: 'Subdocument updated successfully!', data: updateResult });
    } catch (error) {
        await db.disconnect();
        res.status(500).send({ message: 'An error has occurred' });

    };
}

// delete
const handleDeleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.connect();
        const updateResult = await Categorie.findOneAndUpdate({ _id: req.query.id }, {
            $pull: {
                subCategories: {
                    _id: req.query.subid
                }
            }
        }, { new: true });
        await db.disconnect();
        res.send({ message: "Successfully deleted", data: updateResult });
    } catch (error) {
        await db.disconnect();
        res.status(500).send({ message: 'An error has occurred' });
    }
};

export default handler;