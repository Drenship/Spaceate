import { NextApiRequest, NextApiResponse } from 'next';
import { sendMail } from '@libs/utils/email-sendgrid';
import db from '@libs/database/dbConnect';
import User from '@libs/models/User';
import { generateUUID } from '@libs/utils';

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
    default:
      return res.status(405).send({ message: 'Method not allowed' });
  }
}

const VERIFY_MAIL = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ message: "we need data for send mail" });
    }

    const token = generateUUID();

    await db.connect();

    const dbUser = await User.findOne({ email: user.email })

    if (!dbUser) {
      return res.status(404).json({ message: "this email is not found" });
    }

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

    res.status(result.status).json({ message: result.message, result: result });

  } catch (error) {
    res.status(500).json({ message: `Erreur lors de l'envoi de l'email: ${error}` });
  } finally {
    await db.disconnect();
  }
}

export default handler;