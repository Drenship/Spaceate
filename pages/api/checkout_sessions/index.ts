const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import { NextApiRequest, NextApiResponse } from 'next';
import { CURRENCY } from "@config/index"
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import { formatAmountForStripe } from "@libs/utils/stripe-helpers";
import { TypeCartItem } from '@libs/typings';
import { activePromotion, priceWithPromotion } from '@libs/utils/productUtils';
import Order from '@libs/models/Order';
import db from '@libs/database/dbConnect';

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

    const { user, order_id } = req.body



    try {

        // get order in apy
        await db.connect();
        const order = await Order.findById(order_id, { orderItems: 1, shippingMethode: 1, shippingAddress: 1 });
        if (!order) {
            return res.status(404).json({ message: 'order not found' });
        }

        const cart_line_items = order.orderItems.map((item: TypeCartItem) => ({
            name: item.name,
            description: "test description",
            amount: formatAmountForStripe(priceWithPromotion(item, activePromotion(item)), CURRENCY),
            currency: CURRENCY,
            quantity: item.quantity,
        }));

        const fixe_shipping_options = { shipping_rate_data: order.shippingMethode };

        // verify if customer id existe

        const customer = await stripe.customers.create({
            name: user.name,
            email: user.email,
            address: {
                line1: order.shippingAddress.streetAddress,
                city: order.shippingAddress.city,
                postal_code: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
            },
        });

        // save customer id

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            submit_type: 'pay',
            payment_method_types: ['card'],

            billing_address_collection: "auto",

            shipping_options: [fixe_shipping_options],

            //shipping_address_collection: {
            //    allowed_countries: ["FR"],
            //},

            line_items: cart_line_items,
            success_url: `${req.headers.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cart`,

            customer: customer.id,

            metadata: {
                userId: user._id,
                userEmail: user.email,
                order_id: order_id
            }
        });

        res.status(200).json(checkoutSession);
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err, statusCode: 500, message: "Internal server error" });
    } finally {
        db.disconnect();
    }

}

export default handler;