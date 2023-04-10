import db from "./dbConnect";
import User from "@libs/models/User";
import Account from "@libs/models/Account";

/** @return { import("next-auth/adapters").Adapter } */
export default function MongooseAdapter(client, options = {}) {
    return {
        async createUser(profile) {
            await db.connect();
            console.log("createUser")
            const user = {
                ...profile,
                email_is_verified: true,
                password: profile.password || "null",
            };
            const result = await User.create(user);
            await db.disconnect();
            return result;
        },
        async getUser(id) {
            await db.connect();
            console.log("getUser")
            const result = await User.findById(id).lean();
            await db.disconnect();
            return result;
        },
        async getUserByEmail(email) {
            await db.connect();
            console.log("getUserByEmail")
            const result = await User.findOne({ email }).lean();
            await db.disconnect();
            return result;
        },
        async getUserByAccount({ providerAccountId, provider }) {
            await db.connect();
            console.log("getUserByAccount", { providerAccountId, provider })
            const account = await Account.findOne({
                providerAccountId,
                provider,
            }).lean();
            console.log("getUserByAccount", { account })
            if (!account) {
                await db.disconnect();
                return null;
            }
            const user = await User.findById(account.userId).lean();
            await db.disconnect();
            return user;
        },
        async updateUser(user) {
            await db.connect();
            console.log("updateUser")
            const updatedUser = await User.findByIdAndUpdate(user.id, user, { new: true }).lean();
            await db.disconnect();
            return updatedUser;
        },
        async linkAccount(data) {
            console.log("linkAccount data:", data); // Log data in linkAccount

            await db.connect();

            // Find or create a new user with the email address from the Google account
            const userEmail = data.email;
            let user = await User.findOne({ email: userEmail });
            if (!user) {
                user = await User.create({ email: userEmail });
            }

            // Use the ObjectId of the found or created user as the userId field value
            const account = {
                ...data,
                userId: user._id,
            };

            const result = await Account.create(account);
            await db.disconnect();

            return result;
        },

        async unlinkAccount({ providerAccountId, provider }) {
            await db.connect();
            console.log("unlinkAccount")
            await Account.findOneAndDelete({ providerAccountId, provider });
            await db.disconnect();
        },
    };
}
