import db from '@libs/database/dbConnect'
import Categorie from '@libs/models/Categorie'
import { NextApiRequest, NextApiResponse } from 'next'
import { cacheMiddleware } from '@libs/Middleware/Api.Middleware.x-cache'
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: false, adminOnly: false })(req, res, () => {
        cacheMiddleware(30)(req, res, async () => {
            console.log("api called", new Date())
            await db.connect();
            const categories = await Categorie.find();
            await db.disconnect();
            res.send(categories);
        })
    })
}