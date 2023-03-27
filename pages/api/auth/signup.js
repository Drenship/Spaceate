import bcryptjs from 'bcryptjs';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';
import axios from 'axios';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return;
    }
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

    const newUser = new User({
        name,
        email,
        password: bcryptjs.hashSync(password),
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