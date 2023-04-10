import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';
import axios from 'axios';
import { validateEmail, verifyPassword } from '@libs/utils/formvalidate';
import { PASSWORD_REQUIRED } from '@config/index';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return handlePostRequest(req, res);
        default:
            return res.status(400).send({ message: 'Method not allowed' });
    }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const { name, email, password } = req.body;
        if (
            !name ||
            !email ||
            !email.includes('@') ||
            !password
        ) {
            return res.status(422).json({
                message: 'Validation error',
            });
        }

        const isValidEmail = validateEmail(email)
        if (isValidEmail) {
            return res.status(422).json({ message:"L'email n'est pas valide." });
        }

        const [isValidPassword] = verifyPassword(password, PASSWORD_REQUIRED)
        if (isValidPassword) {
            return res.status(422).json({ message: 'Le mot de passe ne remplit pas les conditions de sécurité.' });
        }

        await db.connect();

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            await db.disconnect();
            return res.status(422).json({ message: 'User exists already!' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: false,
        });

        const user = await newUser.save();

        await axios.post(`${process.env.NEXTDOMAIN_URL}/api/mailer`, {
            emailType: 'VERIFY_MAIL',
            user: {
                email: user.email
            }
        })

        return res.status(201).send({
            message: 'Created user !',
            ...user
        });
    } catch (error) {
        return res.status(500).send({ message: 'Une erreur est survenue !' });
    } finally {
        await db.disconnect();
    }
}

export default handler;