import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google"
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

        if (!user.email) {
            return user;
        }

        const userLastInfo = await User.findOne({ email: user.email }, {
            _id: 1,
            name: 1,
            email: 1,
            email_is_verified: 1,
            isAdmin: 1,
            updatedAt: 1,
            createdAt: 1,
        });

        if (!userLastInfo) {
            return user;
        }

        return {
            ...userLastInfo._doc,
            updatedAt: new Date().toISOString()
        };

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
        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            email_is_verified: updatedUser.email_is_verified,
            isAdmin: updatedUser.isAdmin,
            updatedAt: updatedUser.updatedUser,
            createdAt: updatedUser.createdAt
        }
    }
    return callback;
}

export const authOptions: AuthOptions = {

    callbacks: {
        async jwt({ token, user }) {
            if (!token.updatedAt) {
                const getUser = await updateUser(token)

                return {
                    ...token,
                    image: user?.image || token?.picture || null,
                    _id: getUser._id,
                    isAdmin: getUser.isAdmin,
                    email_is_verified: getUser.email_is_verified,
                    updatedAt: getUser.updatedAt,
                    createdAt: getUser.createdAt,
                };
            }
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
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                await db.connect();
                const user = await User.findOne({ email: credentials.email }, {
                    _id: 1,
                    name: 1,
                    password: 1,
                    gender: 1,
                    email: 1,
                    email_is_verified: 1,
                    isAdmin: 1,
                    cart: 1,
                    searchHistory: 1,
                    wishlist: 1,
                    recentlyViewed: 1,
                    updatedAt: 1,
                    createdAt: 1,
                });
                await db.disconnect();

                if (!user || !user?.password) {
                    throw new Error('Invalid credentials');
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials');
                }

                return user;
            },
        }),
    ],
    pages: {
        signIn: '/',
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);