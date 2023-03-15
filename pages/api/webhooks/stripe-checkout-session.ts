import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from "micro";
import Order from '@libs/models/Order';
import db from '@libs/database/dbConnect';
import { TypeCartItem } from '@libs/typings';
import Product from '@libs/models/Product';

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
                 await db.connect();
                const order = await Order.findById(session.metadata.order_id);
                if (order) {

                    order.shippingAddress = {
                        fullName: session.shipping_details.name,
                        address: session.shipping_details.address.line1,
                        address2: session.shipping_details.address.line2,
                        city: session.shipping_details.address.city,
                        postalCode: session.shipping_details.address.postal_code,
                        country: session.shipping_details.address.country,
                    }

                    order.paymentMethod = session.payment_method_types[0];
                    order.itemsPrice = session.amount_subtotal / 100;
                    order.shippingPrice = session.shipping_cost.amount_total / 100;
                    order.taxPrice = (session.amount_subtotal * 0.055) / 100;
                    order.totalPrice = session.amount_total / 100;
                    order.paymentResultStripe = session;
                    order.isPaid = true;
                    order.paidAt = new Date();

                    await order.save();

                    const updateProducts = async () => {
                        try {
                            for (let product of order.orderItems) {
                                const result = await Product.updateOne({ _id: product._id }, {
                                    $inc: {
                                        "stats.totalSellInAwait": product.quantity - (product.quantity * 2),
                                        "stats.totalSelled": product.quantity,
                                    }
                                });
                                console.log(result);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }
                    await updateProducts();

                    await db.disconnect();

                    res.send({ message: 'Order update successfully' });
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