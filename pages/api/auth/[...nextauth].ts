import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google"
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';
import MongooseAdapter from "@libs/database/mongooseAdapter";
import Account from "@libs/models/Account";

const adapterInstance = MongooseAdapter();

export const authOptions: AuthOptions = {
    //adapter: adapterInstance,
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
                    password: 1,
                    email: 1,
                    email_is_verified: 1,
                    isAdmin: 1,
                    orders: 0
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
    callbacks: {
        async jwt({ token, user }) {
            if (user?._id) token._id = user._id;
            if (user?.email_is_verified) token.email_is_verified = user.email_is_verified;
            if (user?.isAdmin) token.isAdmin = user.isAdmin;
            if (user?.email && !user?._id) {
                await db.connect();
                const getUser = await User.findOne({ email: user.email }, {
                    _id: 1,
                    email: 1,
                    email_is_verified: 1,
                    isAdmin: 1,
                    orders: 0
                });
                await db.disconnect();
                if (getUser?._id) token._id = getUser._id;
                if (getUser?.email_is_verified) token.email_is_verified = getUser.email_is_verified;
                if (getUser?.isAdmin) token.isAdmin = getUser.isAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?._id) session.user._id = token._id;
            if (token?.email_is_verified) session.user.email_is_verified = token.email_is_verified;
            if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
            return session;
        },
       /* async signIn({ user, account, profile }) {
            // Vérifiez si l'utilisateur existe déjà dans la collection Account
            if (!account) return false;

            console.log("account:", { user, account, profile }); // Log the account object

            const existingAccount = await Account.findOne({
                userId: user.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId as string,
            }).lean();

            // Si le compte n'existe pas, liez le compte externe à l'utilisateur existant
            if (!existingAccount) {
                const accountData = {
                    userId: user.id,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId as string,
                };
                await adapterInstance.linkAccount(accountData);
            }

            return true; // Autorisez la connexion
        },*/
    },

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