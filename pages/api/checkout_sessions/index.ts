const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import { NextApiRequest, NextApiResponse } from 'next';
import { CURRENCY } from "@config/index"
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import { formatAmountForStripe } from "@libs/utils/stripe-helpers";
import { TypeCartItem } from '@libs/typings';
import { activePromotion, priceWithPromotion } from '@libs/utils/productUtils';

import ShippingOptions from '@datassets/ShippingOptions.json'

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

    const { user, order_id, items: cartItems } = req.body

    const cart_line_items = cartItems.map((item: TypeCartItem) => ({
        name: item.name,
        description: "test description",
        amount: formatAmountForStripe(priceWithPromotion(item, activePromotion(item)), CURRENCY),
        currency: CURRENCY,
        quantity: item.quantity,
    }));

    try {
        
        // get order in apy


        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            submit_type: 'pay',
            payment_method_types: ['card'],

            billing_address_collection: "auto",
            //shipping: {
            //    name: user.name,
            //    address: userAddress,
            //},
            shipping_options: ShippingOptions,
            shipping_address_collection: {
                allowed_countries: ["FR"],
            },

            line_items: cart_line_items,
            success_url: `${req.headers.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cart`,

            customer_email: user.email,

            metadata: {
                userId: user._id,
                userEmail: user.email,
                order_id: order_id
            }
        });

        res.status(200).json(checkoutSession);
    } catch (err) {
        res.status(500).json({ err: err, statusCode: 500, message: "Internal server error" });
    }

}

export default handler;