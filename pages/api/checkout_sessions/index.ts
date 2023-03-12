import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import { formatAmountForStripe } from "@libs/utils/stripe-helpers";
import { CURRENCY } from "@config/index"
import { TypeCartItem } from '@libs/typings';

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

    const cartItems: TypeCartItem[] = req.body.items;
    const order_id = req.body.order_id
    const user = req.body.user;

    // This is the shape in which stripe expects the data to be
    const cart_line_items = cartItems.map((item) => ({
        name: item.name,
        description: "test description",
        amount: formatAmountForStripe(item.price, CURRENCY),
        currency: CURRENCY,
        quantity: item.quantity,
    }));

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            submit_type: 'pay',
            payment_method_types: ['card'],

            billing_address_collection: "auto",
            shipping_options: [
                {
                    shipping_rate: "shr_1MVDw5HSzwBR9D7quUkpHLd6",
                },
                {
                    shipping_rate: 'shr_1MkbcxHSzwBR9D7qlsyGqMbG',
                }
            ],
            shipping_address_collection: {
                allowed_countries: ["FR"],
            },

            line_items: cart_line_items,
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cart`,

            metadata: {
                userId: user._id,
                order_id: order_id
            }
        });

        res.status(200).json(checkoutSession);
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err, statusCode: 500, message: "Internal server error" });
    }

}

export default handler;