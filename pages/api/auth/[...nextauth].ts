import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google"
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';



export const authOptions: AuthOptions = {
    callbacks: {
        async jwt({ token, user }) {
            if (user?._id) token._id = user._id;
            if (user?.email_is_verified) token.email_is_verified = user.email_is_verified;
            if (user?.isAdmin) token.isAdmin = user.isAdmin;
            return token;
        },
        async session({ session, token }) {
            if (token?._id) session.user._id = token._id;
            if (token?.email_is_verified) session.user.email_is_verified = token.email_is_verified;
            if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
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
                    email: 1,
                    email_is_verified: 1,
                    isAdmin: 1,
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