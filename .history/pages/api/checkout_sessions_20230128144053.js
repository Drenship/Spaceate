// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2022-08-01",
});


export default async function handler(req, res) {
    if (req.method === "POST") {
        const items = req.body.items;

        // This is the shape in which stripe expects the data to be
        const transformedItems = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: `${req.headers.origin}/${item.main_image}`,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        try {
            // Create Checkout Sessions from body params
            const params = {
                payment_method_types: ["card"],
                // shipping_address_collection: {
                //   allowed_countries: ["US", "CA", "GB"],
                // },
                line_items: transformedItems,
                payment_intent_data: {},
                mode: "payment",
                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/cart`,
                metadata: {
                    images: JSON.stringify(items.map((item) => item.main_image)),
                },
            };
            const checkoutSession = await stripe.checkout.sessions.create(params);

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