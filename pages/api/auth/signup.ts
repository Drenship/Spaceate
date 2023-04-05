import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';
import axios from 'axios';



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return handlePostRequest(req, res);
        default:
            return res.status(400).send({ message: 'Method not allowed' });
    }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    const { name, email, password } = req.body;
    if (
        !name ||
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 5
    ) {
        res.status(422).json({
            message: 'Validation error',
        });
        return;
    }

    await db.connect();

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        res.status(422).json({ message: 'User exists already!' });
        await db.disconnect();
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        isAdmin: false,
    });

    const user = await newUser.save();
    await db.disconnect();

    await axios.post(`${process.env.NEXTDOMAIN_URL}/api/mailer`, {
        emailType: 'VERIFY_MAIL',
        user: {
            email: user.email
        }
    })

    res.status(201).send({
        message: 'Created user !',
        ...user
    });
}

export default handler;