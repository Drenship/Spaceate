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
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user = { ...token._doc };
            
            // verify last update 
            // if last update est plus vielle de x update avec un call api 
            
            return session;
        }
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                await db.connect();
                const user = await User.findOne({
                    email: credentials.email,
                }, {

                });
                await db.disconnect();
                if (user && bcryptjs.compareSync(credentials.password, user.password)) {

                    return user;
                }
                throw new Error('Invalid email or password');
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
});