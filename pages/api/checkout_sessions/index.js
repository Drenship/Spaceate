// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import { formatAmountForStripe } from "@libs/utils/stripe-helpers";
import { CURRENCY } from "@config/index"


export default async function handler(req, res) {
    if (req.method === "POST") {
        const cartItems = req.body.items;

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
                    email: "florentin.greneche@gmail.com"
                }
            });

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