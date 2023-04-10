import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: true, adminOnly: false })(req, res, () => {
        switch (req.method) {
            case 'POST':
                return handlePostRequest(req, res);
            default:
                return res.status(400).send({ message: 'Method not allowed' });
        }
    })
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { query, user } = req.body;

        console.log(req.body)

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        await db.connect();
        const userUpdate = await User.findById(user._id);
        if (!userUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }
        userUpdate.searchHistory.push({ query });
        await userUpdate.save();

        return res.status(201).json({ message: 'Search history entry added successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error adding search history entry' });
    } finally {
        await db.disconnect();
    }
};

export default handler;
