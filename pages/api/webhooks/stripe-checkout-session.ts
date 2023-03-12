import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from "micro";
import Order from '@libs/models/Order';
import db from '@libs/database/dbConnect';
import { TypeCartItem } from '@libs/typings';

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return handlePostRequest(req, res);
        default:
            return res.status(400).send({ message: 'Method not allowed' });
    }
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

            //if(session.livemode === false) return res.status(400).send({ message: "This session is not ni livemode, u can't create order" }); 

            try {
                // insert order
                const orderItems: TypeCartItem[] = JSON.parse(session.metadata.cartItems).map((item: TypeCartItem) => ({
                    _id: item._id,
                    name: item.name,
                    slug: item.slug,
                    quantity: item.quantity,
                    image: item.main_image,
                    price: item.price,
                    price_in: item.price_in
                }))

                await db.connect();
                const order = await Order.findById(req.query.id);
                if (order) {
                    order.shippingAddress = {
                        fullName: session.shipping_details.name,
                        address: session.shipping_details.address.line1,
                        address2: session.shipping_details.address.line2,
                        city: session.shipping_details.address.city,
                        postalCode: session.shipping_details.address.postal_code,
                        country: session.shipping_details.address.country,
                    };
                    order.paymentMethod = session.payment_method_types[0];
                    order.itemsPrice = session.amount_subtotal / 100;
                    order.shippingPrice = session.shipping_cost.amount_total / 100;
                    order.taxPrice = (session.amount_subtotal * 0.055) / 100;
                    order.totalPrice = session.amount_total / 100;
                    order.paymentResultStripe = session;
                    order.isPaid = true;
                    order.paidAt = new Date();

                    await order.save();
                    await db.disconnect();
                    res.send({ message: 'Order created successfully' });
                } else {
                    await db.disconnect();
                    return res.status(400).send({ message: "Order not found" });
                }
            } catch (err) {
                await db.disconnect();
                return res.status(400).send({ err: err, message: "Error Webhook insert order payment" });
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