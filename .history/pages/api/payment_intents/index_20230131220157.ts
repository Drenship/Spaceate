import { NextApiRequest, NextApiResponse } from 'next';

import { CURRENCY } from '@config/index';
import { formatAmountForStripe } from '@libs/utils/stripe-helpers';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2022-11-15" //'2020-03-02',
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { amount }: { amount: number } = req.body;
        try {

            // Create PaymentIntent from body params.
            const params: Stripe.PaymentIntentCreateParams = {
                payment_method_types: ['card'],
                amount: formatAmountForStripe(amount, CURRENCY),
                currency: CURRENCY,
            };
            
            const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
                params
            );

            res.status(200).json(payment_intent);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}