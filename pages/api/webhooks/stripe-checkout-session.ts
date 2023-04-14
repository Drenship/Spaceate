import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from "micro";
import Order from '@libs/models/Order';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';
import { sendMail } from '@libs/utils/email-sendgrid';
import User from '@libs/models/User';

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

        // event trigger
        switch (event.type) {
            case "checkout.session.completed":
                return handleStripeCheckoutSessionCompleted(req, res, event);
            case "charge.refunded":
                return handleStripeChargeRefunded(req, res, event);
            default:
                return res.status(400).send({ message: 'Method not allowed on this Webhook', eventType: event.type });
        }

    } catch (error) {
        res.status(500).send({ message: 'An error has occurred' });
    }
};


const handleStripeCheckoutSessionCompleted = async (req: NextApiRequest, res: NextApiResponse, event: any) => {
    const session = event.data.object;

    // verify si la session en live mode
    if(process.env.NODE_ENV !== 'development') {
        //if(session.livemode === false) return res.status(400).send({ message: "This session is not ni livemode, u can't create order" }); 
    }

    try {
        await db.connect();

        //verify is session id already existe and is pay
        const orderIsAlreadyUpdate = await Order.findOne({ stripe_pay_id: session.id });
        if (orderIsAlreadyUpdate && orderIsAlreadyUpdate.isPaid === true) {
            return res.send({ message: 'This session id already pay' });
        }

        const order = await Order.findById(session.metadata.order_id)
        if (order) {
            // verify is order is pay
            if (order.isPaid === true) {
                return res.send({ message: 'This order is already paid' });
            }

            order.stripeDetails.session_id = session.id;
            order.stripeDetails.customer_id = session.customer;
            order.stripeDetails.payment_intent_id = session.payment_intent;

            order.stripeDetails.paymentResultStripe = session;
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
            order.isPaid = true;
            order.paidAt = new Date();

            const updateResult = await order.save();

            try {
                // update stats and stock of all cart product
                const updateStatsAndStockProducts = async () => {
                    for (let product of updateResult.orderItems) {
                        await Product.updateOne({ _id: product._id }, {
                            $inc: {
                                "stats.totalSellInAwait": product.quantity - (product.quantity * 2),
                                "stats.totalSelled": product.quantity,
                            }
                        });
                    }
                }
                await updateStatsAndStockProducts();

                const result = await sendMail({
                    from: process.env.WEBSITE_EMAIL || 'florentin.greneche@gmail.com',
                    to: session.metadata.userEmail,
                    subject: 'Confirmation de commande',
                    text: 'Votre commande a bien était payer !',
                    html: '<p style={{text-color: "blue"}}">Votre commande a bien était payer.</p>',
                })

                return res.send({ message: 'Order update successfully', email: result.message });

            } catch (err) {
                return res.send({ message: 'update Stats And Stock Products fail' });
            }


        } else {
            return res.status(400).send({ message: "Order not found" });
        }
    } catch (err) {
        return res.status(400).send({ err: err, message: "Error Webhook insert order payment" });
    } finally {
        await db.disconnect();
    }
}

const handleStripeChargeRefunded = async (req: NextApiRequest, res: NextApiResponse, event: any) => {
    const session = event.data.object;
    try {

        await db.connect();
        const order = await Order.findOne({ "stripeDetails.charge_id": session.id })
        if (order) {
            // verify is order is pay
            if (order.isRefund === true) {
                return res.send({ message: 'This order is already refund' });
            }

            order.isRefund = true;
            order.refundAt = new Date();

            const updateResult = await order.save();

            const updateStatsAndStockProducts = async () => {
                for (let product of updateResult.orderItems) {
                    await Product.updateOne({ _id: product._id }, {
                        $inc: {
                            countInStock: product.quantity,
                            "stats.totalSelled": product.quantity - (product.quantity * 2),
                        }
                    });
                }
            }
            await updateStatsAndStockProducts();

            const user = await User.findById(order.user, { email: 1 })

            if (user && user?.email) {
                const result = await sendMail({
                    from: process.env.WEBSITE_EMAIL || 'florentin.greneche@gmail.com',
                    to: user.email,
                    subject: 'Confirmation de remboursement',
                    text: 'Votre commande a bien été remboursé !',
                    html: '<p style={{text-color: "blue"}}">Votre commande a bien été remboursé .</p>',
                })
                return res.send({ message: "Order refund is successfully updated", email: result.message });
            }

            return res.send({ message: "Order refund is successfully updated" });

        } else {
            return res.status(404).send({ message: "Order is not found " + session.id });
        }
    } catch (error) {
        return res.status(500).send({ message: "A error is occured", error: error });
    } finally {
        await db.disconnect();
    }
}

export default handler;

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};