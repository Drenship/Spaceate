import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2020-08-27',
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: true, adminOnly: false })(req, res, () => {
        switch (req.method) {
            case 'POST':
                return handlePostRequest(req, res);
            default:
                return res.status(400).send({ message: 'Method not allowed' });
        }
    })
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    
    console.log(req.body)
    const { sessionId } = req.body;

    try {
        // Récupérer la session de paiement
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Vérifier si la session a un ID de charge
        if (!session.payment_intent) {
            return res.status(400).json({ statusCode: 400, message: 'La session de paiement n\'a pas d\'ID de charge.' });
        }

        // Récupérer l'intention de paiement (payment_intent)
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        // Vérifier si l'intention de paiement a un ID de charge
        if (!paymentIntent.charges.data.length) {
            return res.status(400).json({ statusCode: 400, message: 'L\'intention de paiement n\'a pas d\'ID de charge.' });
        }

        // Récupérer l'ID de la charge
        const chargeId = paymentIntent.charges.data[0].id;

        // Créer un remboursement
        const refund = await stripe.refunds.create({
            charge: chargeId,
        });

        res.status(200).json(refund);
    } catch (error) {
        console.log(error)
        res.status(500).json({ statusCode: 500, message: error });
    }
}

export default handler;
