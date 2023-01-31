// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2022-08-01",
});


function formatAmountForStripe(amount, currency) {
    let numberFormat = new Intl.NumberFormat(['en-US'], {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
    })
    const parts = numberFormat.formatToParts(amount)
    let zeroDecimalCurrency = true
    for (let part of parts) {
        if (part.type === 'decimal') {
            zeroDecimalCurrency = false
        }
    }
    return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const items = req.body.items;

        // This is the shape in which stripe expects the data to be
        const transformedItems = items.map((item) => ({

            name: item.name,
            images: `${req.headers.origin}/${item.main_image}`,

            amount: formatAmountForStripe(item.price, "eur"),
            currency: "eur",

            quantity: item.quantity,
        }));

        console.log(transformedItems)

        try {
            const checkoutSession = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],

                shipping_address_collection: {
                    allowed_countries: ["FR"],
                },

                line_items: transformedItems,
                payment_intent_data: {},

                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/cart`,

                metadata: {
                    images: JSON.stringify(items.map((item) => item.main_image)),
                },
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