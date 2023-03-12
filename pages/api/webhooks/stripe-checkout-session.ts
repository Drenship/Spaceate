import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import { buffer } from "micro";
//import Order from '@libs/models/Order';
import Order from '@libs/models/OrderTest';
import db from '@libs/database/dbConnect';

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: true, adminOnly: true })(req, res, () => {
        switch (req.method) {
            case 'POST':
                return handlePostRequest(req, res);
            default:
                return res.status(400).send({ message: 'Method not allowed' });
        }
    })
};

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const requestBuffer = await buffer(req);
        const payload = requestBuffer.toString();
        const signature = req.headers["stripe-signature"];

        let event;
        // verify event comes from stripe
        try {
            event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
        } catch (err) {
            return res.status(400).send({ message: "Error Webhook signature verification" });
        }


        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            try {
                // insert order
                await db.connect();
                const newOrder = new Order({
                    object: event.data
                })
                await newOrder.save();
                await db.disconnect();
                res.send({ message: 'Order created successfully' });

            } catch (err) {
                console.error(err);
                return res.status(400).send({ message: "Error Webhook insert order payment" });
            }
        } else {
            return res.status(400).send({ message: "Error Webhook event not allowed" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'An error has occurred' });
    }
};






export default handler;

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};