import { NextApiRequest, NextApiResponse } from 'next';

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST' || req.method === 'GET') {
    // Configurez les options de l'email

    const msg = {
      from: req.body.from || 'automatically@spaceate.vercel.app',
      to: req.body.to || 'onyxx61@gmail.com',
      subject: req.body.subject || 'Sujet par défaut',
      text: req.body.text || 'Ceci est un message par défaut.',
      html: req.body.html || '<p>Ceci est un message par défaut.</p>',
    };

    // Envoyez l'email
    try {
      await sgMail.send(msg);
      res.status(200).json({ message: 'Email envoyé avec succès.' });
    } catch (error) {
      res.status(500).json({ message: `Erreur lors de l'envoi de l'email: ${error}` });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée.' });
  }
}
