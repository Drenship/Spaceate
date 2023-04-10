import { NextApiRequest, NextApiResponse } from 'next';
import { sendMail } from '@libs/utils/email-sendgrid';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';
import { generateCode, generateUUID } from '@libs/utils';
import { validateEmail } from '@libs/utils/formvalidate';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return handlePostRequest(req, res);
    default:
      return res.status(405).send({ message: 'Method not allowed' });
  }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.body.emailType) {
    case 'VERIFY_MAIL':
      return VERIFY_MAIL(req, res);
    case 'VERIFY_NEW_MAIL':
      return VERIFY_NEW_MAIL(req, res);
    default:
      return res.status(405).send({ message: 'The send method is not allowed' });
  }
}

const VERIFY_MAIL = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ message: "we need data for send mail" });
    }


    await db.connect();

    const dbUser = await User.findOne({ email: user.email })

    if (!dbUser) {
      return res.status(404).json({ message: "this email is not found" });
    }

    const token = generateUUID();
    dbUser.emailVerificationToken = token;
    dbUser.emailVerificationTokenExpires = Date.now() + 60 * 60 * 1000; // 1H
    await dbUser.save();

    const verificationUrl = `${process.env.NEXTDOMAIN_URL}/api/user/verify-email/${token}`;

    const result = await sendMail({
      from: process.env.WEBSITE_EMAIL || 'florentin.greneche@gmail.com',
      to: user.email,
      subject: 'Vérification de votre adresse e-mail',
      text: `Veuillez cliquer sur le lien suivant pour vérifier votre adresse e-mail: ${verificationUrl}`,
      html: `Veuillez cliquer sur le lien suivant pour vérifier votre adresse e-mail: <a href="${verificationUrl}">${verificationUrl}</a>`,

    })

    return res.status(result.status).json({ success: true, message: result.message, result: result });

  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: `Erreur lors de l'envoi de l'email: ${error}` });
  } finally {
    await db.disconnect();
  }
}

const VERIFY_NEW_MAIL = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ message: "we need data for send mail" });
    }

    if (user.currentEmail === user.newEmail) {
      return res.status(400).json({ message: "C'est déjà botre email actuelle." });
    }

    if (!validateEmail(user.newEmail)) {
      return res.status(400).json({ message: "L'email n'est pas valide." });
    }

    const code = generateCode();

    await db.connect();

    const newMailAlreadyExist = await User.findOne({ email: user.newEmail })

    if (newMailAlreadyExist) {
      return res.status(409).json({ message: "L'email existe déjà dans la base de données." });
    }

    const dbUser = await User.findById(user._id)

    if (!dbUser) {
      return res.status(404).json({ message: "this user is not found" });
    }

    dbUser.security.code = code;
    dbUser.security.codeEndDate = Date.now() + 30 * 60 * 1000; // 30min
    await dbUser.save();

    const result = await sendMail({
      from: process.env.WEBSITE_EMAIL || 'florentin.greneche@gmail.com',
      to: user.newEmail,
      subject: 'Votre code de vérification',
      text: `Cher(e) ${user.name},
      
      Pour confirmer votre adresse e-mail et continuer l'inscription, veuillez entrer le code de vérification suivant dans [Votre service] :
      
      Code de vérification : ${code}
      
      Ce code est valable pendant 30 minutes à compter de la réception de cet e-mail. Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail.
            
      Cordialement`,

      html: `Cher(e) ${user.name},
      <br/>
      <br/>
      Pour confirmer votre adresse e-mail et continuer l'inscription, veuillez entrer le code de vérification suivant dans [Votre service] :
      <br/>
      <br/>
      Code de vérification : ${code}
      <br/>
      <br/>
      Ce code est valable pendant 30 minutes à compter de la réception de cet e-mail. Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail.
      <br/>
      <br/>
      Cordialement`,

    })

    return res.status(result.status).json({ success: true, message: result.message, result: result });

  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: `Erreur lors de l'envoi de l'email: ${error}` });
  } finally {
    await db.disconnect();
  }
}

export default handler;