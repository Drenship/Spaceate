// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";
import { formatAmountForStripe } from "@libs/utils/stripe-helpers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2020-03-02",
});

export default async function handler(req, res) {
    if (req.method === "POST") {
        const items = req.body.items;

        // This is the shape in which stripe expects the data to be
        const transformedItems = items.map((item) => ({
            //images: `${req.headers.origin}/${item.main_image}`,
            name: item.name,
            amount: formatAmountForStripe(item.price, "eur"),
            currency: "eur",
            quantity: item.quantity,
        }));

        console.log(transformedItems)

        try {
            const checkoutSession = await stripe.checkout.sessions.create({
                mode: "payment",
                submit_type: 'donate',
                payment_method_types: ['card'],

                amount_shipping: 9,

                shipping_address_collection: {
                    allowed_countries: ["FR"],
                },

                line_items: transformedItems,
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