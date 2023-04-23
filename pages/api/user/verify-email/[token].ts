import { NextApiRequest, NextApiResponse } from 'next';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return handlePostRequest(req, res);
        default:
            return res.status(405).send({ message: 'Method not allowed' });
    }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const { token } = req.query;

        await db.connect();

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Le lien de vérification est invalide ou expiré.' });
        }

        if (user.email_is_verified) {
            return res.status(200).json({ message: 'Votre email est déjà verifier !' });
        }

        user.email_is_verified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;
        await user.save();

        return res.status(200).json({ message: 'Votre adresse e-mail a été vérifiée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la vérification de votre adresse e-mail.' });
    } finally {
        await db.disconnect();
    }
}

export default handler;