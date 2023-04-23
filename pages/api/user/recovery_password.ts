import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
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
        const { action, email, code, newPassword } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        await db.connect();
        const dbUser = await User.findOne({ email });

        if (!dbUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        switch (action) {
            case 'VERIFY_CODE':
                return verifyCode(req, res, dbUser, code);
            case 'UPDATE_PASSWORD':
                return updatePassword(req, res, dbUser, newPassword);
            default:
                return res.status(405).send({ message: 'Action not allowed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    } finally {
        await db.disconnect();
    }
};


const verifyCode = async (req: NextApiRequest, res: NextApiResponse, user: any, code: string) => {
    try {
        if (!code) {
            return res.status(400).json({ message: 'Code is required.' });
        }

        if (Date.now() > user.security.codeEndDate) {
            return res.status(400).json({ message: 'Code has expired.' });
        }

        const isCodeValid = await bcrypt.compare(code, user.security.code);

        if (!isCodeValid) {
            return res.status(400).json({ message: 'Invalid code.' });
        }

        return res.status(200).json({ success: true, message: 'Code verified successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while verifying the code.' });
    } finally {
        await db.disconnect();
    }
};

const updatePassword = async (req: NextApiRequest, res: NextApiResponse, user: any, newPassword: string) => {
    try {
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the password.' });
    } finally {
        await db.disconnect();
    }
};


export default handler;
