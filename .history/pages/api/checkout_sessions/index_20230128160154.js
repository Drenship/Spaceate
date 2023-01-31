// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";
import { validateCartItems } from 'use-shopping-cart/utilities'
import { formatAmountForStripe } from "@libs/utils/stripe-helpers";
import { CURRENCY } from "@config/index"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2020-03-02",
});

import database from "@devasset/database.json"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const cartItems = req.body.items;

        // This is the shape in which stripe expects the data to be
        const transformedItems = cartItems.map((item) => ({
            //images: `${req.headers.origin}/${item.main_image}`,
            name: item.name,
            amount: formatAmountForStripe(item.price, CURRENCY),
            currency: CURRENCY,
            quantity: item.quantity,
        }));

        const line_items = validateCartItems(database.products, cartItems);

        try {
            const checkoutSession = await stripe.checkout.sessions.create({
                mode: "payment",
                submit_type: 'pay',
                payment_method_types: ['card'],

                billing_address_collection: "auto",
                shipping_address_collection: {
                    allowed_countries: ["FR"],
                },

                line_items: line_items,
                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/cart`,
            });

            console.log(checkoutSession)
            res.status(200).json(checkoutSession);
        } catch (err) {
            console.log(err)
            const errorMessage = err ? err.message : "Internal server error";
            res.status(500).json({ statusCode: 500, message: errorMessage });
        }
    } else {
        console.log('err 1')
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}