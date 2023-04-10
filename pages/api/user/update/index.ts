import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';
import { authSessionMiddleware } from "@libs/Middleware/Api.Middleware.auth-session";
import db from "@libs/database/dbConnect";
import User from "@libs/models/User";
import { TypeUser } from "@libs/typings";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: true, adminOnly: false })(req, res, () => {
        switch (req.method) {
            case 'POST':
                return handlePostRequest(req, res);
            default:
                return res.status(405).send({ message: 'Méthode non autorisée' });
        }
    });
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.body.updateType) {
        case 'UPDATE_NEW_EMAIL':
            return UPDATE_NEW_EMAIL(req, res);

        case 'UPDATE_PASSWORD':
            return UPDATE_PASSWORD(req, res);

        case 'UPDATE_INFORMATION':
            return UPDATE_INFORMATION(req, res);


        case 'ADD_ADDRESS':
            return ADD_ADDRESS(req, res);
        case 'PUT_ADDRESS':
            return PUT_ADDRESS(req, res);
        case 'REMOVE_ADDRESS':
            return REMOVE_ADDRESS(req, res);

        default:
            return res.status(405).send({ message: 'La méthode d\'envoi n\'est pas autorisée' });
    }
};

const UPDATE_NEW_EMAIL = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { user, data } = req.body;
        const { code, newEmail } = data;

        await db.connect();

        const getUser = await User.findById(user._id);

        if (!getUser) {
            return res.status(404).json({ message: "Cet utilisateur n'a pas été trouvé" });
        }

        if (getUser.security.code !== code || code.length !== 7) {
            return res.status(404).json({ message: "Le code n'est pas valide" });
        }

        const interval = new Date(new Date() - (30 * 60 * 1000)).getTime();
        const codeEndDate = new Date(getUser.security.codeEndDate).getTime();
        if (interval >= codeEndDate) {
            return res.status(404).json({ message: "Le code a expiré" });
        }

        const result = await User.updateOne(
            { _id: user._id },
            {
                $set: { email: newEmail },
                $unset: { "security.code": "", "security.codeEndDate": "" },
            }
        );

        if (result.modifiedCount === 1) {
            return res.status(200).json({ success: true, message: "Votre email a bien été mis à jour." });
        } else {
            return res.status(400).json({ success: false, message: "Impossible de mettre à jour votre email. Le code n'est pas valide.", result });
        }
    } catch (error) {
        return res.status(500).json({ message: `Erreur lors de l'insertion en base de données` });
    } finally {
        await db.disconnect();
    }
};

const UPDATE_INFORMATION = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { user, data } = req.body;
        await db.connect()

    } catch (error) {

    } finally {
        await db.disconnect()
    }
}
const UPDATE_PASSWORD = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { user, data } = req.body;
        const { oldPassword, newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword) {
            return res.status(404).json({ message: "Les 2 mots de passe ne sont pas identique !" });
        }

        if (oldPassword === newPassword) {
            return res.status(404).json({ message: "Le nouveau mot de passe est identique au précédent !" });
        }

        await db.connect()

        const getUser = await User.findById(user._id, { password: 1 });

        const isCorrectPassword = await bcrypt.compare(
            oldPassword,
            getUser.password
        );

        if (!isCorrectPassword) {
            return res.status(404).json({ message: "Votre ancien mot de passe est incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        getUser.password = hashedNewPassword;
        await getUser.save();

        return res.status(200).json({ success: true, message: "Votre mot de passe a bien été mis à jour." });

    } catch (error) {
        return res.status(500).json({ message: `Erreur lors de l'insertion en base de données` });
    } finally {
        await db.disconnect()
    }
}

const ADD_ADDRESS = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { user, data } = req.body;
        await db.connect()
        const getUser = await User.findById(user._id);

        if (data.address.isDefault) {
            await updateDefaultAddress(getUser, data.address.addressType);
        }

        getUser.addresses.push(data.address);
        await getUser.save();

        return res.status(200).json({ success: true, message: "Votre adresse a bien été ajoutée." });

    } catch (error) {
        return res.status(500).json({ message: `Erreur lors de l'insertion en base de données` });
    } finally {
        await db.disconnect()
    }
}
const PUT_ADDRESS = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { user, data } = req.body;
        await db.connect()
        const getUser = await User.findById(user._id);
        const address = getUser.addresses.id(data.addressId);

        if (data.address.isDefault) {
            await updateDefaultAddress(getUser, data.address.addressType);
        }

        address.set(data.address);
        await getUser.save();

        return res.status(200).json({ success: true, message: "Votre adresse a bien été mise à jour." });
    } catch (error) {
        return res.status(500).json({ message: `Erreur lors de l'insertion en base de données` });
    } finally {
        await db.disconnect()
    }
}
const REMOVE_ADDRESS = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { user, data } = req.body;
        await db.connect()
        const getUser = await User.findById(user._id);
        getUser.addresses.id(data.addressId).remove();
        await getUser.save();

        return res.status(200).json({ success: true, message: "Votre adresse a bien été supprimée." });

    } catch (error) {
        return res.status(500).json({ message: `Erreur lors de l'insertion en base de données` });
    } finally {
        await db.disconnect()
    }
}

/*
* OTHER FUNCTION FOR ADDRESS
*/
const updateDefaultAddress = async (user: TypeUser, addressType: string) => {
    user.addresses.forEach(address => {
        if (address.addressType === addressType && address.isDefault) {
            address.isDefault = false;
        }
    });
}


export default handler;