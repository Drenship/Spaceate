import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';

export default NextAuth({
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?._id) token._id = user._id;
            if (user?.isAdmin) token.isAdmin = user.isAdmin;
            if (user?.createdAt) token.createdAt = user.createdAt;

            return token;
        },
        async session({ session, token }) {
            if (token?._id) session.user._id = token._id;
            if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
            if (token?.createdAt) session.user.createdAt = token.createdAt;

            return session;
        },
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                await db.connect();
                const user = await User.findOne({
                    email: credentials.email,
                });
                await db.disconnect();
                if (user && bcryptjs.compareSync(credentials.password, user.password)) {

                    const userObject =  {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        createdAt: user.createdAt
                    };

                    return userObject;
                }
                throw new Error('Invalid email or password');
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
});