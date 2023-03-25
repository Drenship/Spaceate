import { NextApiRequest, NextApiResponse } from 'next';
import { isSameOrigin } from '@libs/Middleware/Api.Middleware.cross-origin';
import { sendMail } from '@libs/utils/email-sendgrid';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const requestOrigin = req.headers.origin;
  const targetUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://lodcalhost:3000';

  //if (!requestOrigin || isSameOrigin(requestOrigin, targetUrl) === false) {
  //  return res.status(405).send({ message: 'L\'origine de la requête n\'est pas autorisée.' });
  //}

  switch (req.method) {
    case 'GET':
      return handlePostRequest(req, res);
    default:
      return res.status(405).send({ message: 'Method not allowed' });
  }
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {

  try {

    const result = await sendMail({
      from: process.env.WEBSITE_EMAIL || 'florentin.greneche@gmail.com',
      to: 'florentin.greneche@gmail.com',
      subject: 'Confirmation de commande',
      text: 'Votre commande a bien était payer !',
      html: '<p style={{text-color: "blue"}}">Votre commande a bien était payer.</p>',
    })

    res.status(result.status).json({ message: result.message, result: result });

  } catch (error) {
    res.status(500).json({ message: `Erreur lors de l'envoi de l'email: ${error}` });

  }
}

export default handler;