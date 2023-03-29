import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';

function shouldUpdateUser(lastUpdatedAt, intervalMinutes = 1) {
    const now = new Date();
    const nextUpdateTime = new Date(lastUpdatedAt.getTime() + intervalMinutes * 60 * 1000);
    // Convertir les dates en heures UTC
    const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    const nextUpdateTimeUTC = Date.UTC(nextUpdateTime.getUTCFullYear(), nextUpdateTime.getUTCMonth(), nextUpdateTime.getUTCDate(), nextUpdateTime.getUTCHours(), nextUpdateTime.getUTCMinutes(), nextUpdateTime.getUTCSeconds());
    return nowUTC >= nextUpdateTimeUTC;
}

async function updateUser(user) {
    try {
        await db.connect();

        const userLastInfo = await User.findById(user._id).populate('orders');

        if (!userLastInfo) {
            return user;
        }

        const updatedUser = {
            ...userLastInfo._doc,
            updatedAt: new Date().toISOString()
        };

        return updatedUser;

    } catch (err) {
        return user;
    } finally {
        await db.disconnect();
    }
}

async function updateIfNeeded(source, callback) {
    const lastUpdatedAt = source?.updatedAt ? new Date(source.updatedAt) : new Date().toISOString();

    if (shouldUpdateUser(lastUpdatedAt)) {
        const updatedUser = await updateUser(source);
        callback.updatedAt = updatedUser.updatedUser;
        return { ...callback, ...updatedUser };
    }
    return callback;
}

export default NextAuth({
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (!token.updatedAt) token.updatedAt = new Date().toISOString();

            if (user) {
                return await updateIfNeeded(user, token);
            }
            if (token) {
                return await updateIfNeeded(token, token);
            }

            return token;
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        },
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                await db.connect();
                const user = await User.findOne({ email: credentials.email });
                await db.disconnect();
                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    return user._doc;
                }
                throw new Error('Invalid email or password');
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
});