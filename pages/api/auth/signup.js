import bcryptjs from 'bcryptjs';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';

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

    const result = await sendMail({
        from: process.env.WEBSITE_EMAIL || 'florentin.greneche@gmail.com',
        to: email,
        subject: 'Verifier votre email',
        text: 'Verification de votre email',
        html: '<p style={{text-color: "blue"}}">Verification de votre email.</p>',
    })

    res.status(201).send({
        message: 'Created user !',
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
    });
}

export default handler;