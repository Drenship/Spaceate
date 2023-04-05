import { getSession } from 'next-auth/react';
import bcrypt from 'bcrypt';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';

async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(400).send({ message: `${req.method} not supported` });
    }

    const session = await getSession({ req });
    if (!session) {
        return res.status(401).send({ message: 'signin required' });
    }

    const { user } = session;
    const { name, email, password } = req.body;

    if (
        !name ||
        !email ||
        !email.includes('@') ||
        (password && password.trim().length < 5)
    ) {
        res.status(422).json({
            message: 'Validation error',
        });
        return;
    }

    await db.connect();
    const toUpdateUser = await User.findById(user._id);
    toUpdateUser.name = name;
    toUpdateUser.email = email;

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        toUpdateUser.password = hashedPassword;
    }

    await toUpdateUser.save();
    await db.disconnect();
    res.send({
        message: 'User updated',
    });
}

export default handler;