import { authSessionMiddleware } from "@libs/Middleware/Api.Middleware.auth-session";
import db from "@libs/database/dbConnect";
import User from "@libs/models/User";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: true, adminOnly: false })(req, res, () => {
        switch (req.method) {
            case 'GET':
                return handlePostRequest(req, res);
            default:
                return res.status(405).send({ message: 'Méthode non autorisée' });
        }
    });
};

// get user data if is logged
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { user } = req.body;


        await db.connect()
        const getUser = await User.findOne({ email: user.email }, {
            password: 0,
            emailVerificationToken: 0,
            emailVerificationTokenExpires: 0,
        })
        if(getUser) {
            return res.status(200).json({ user: getUser });
        } 

        return res.status(404).json({});

    } catch (error) {
        return res.status(500).json({ message: `Erreur lors de l'insertion en base de données : ${error}` });
    } finally {
        await db.disconnect()
    }
};


export default handler;