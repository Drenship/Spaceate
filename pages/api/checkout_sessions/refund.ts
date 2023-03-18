import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import Stripe from 'stripe';
import Order from '@libs/models/Order';
import Product from '@libs/models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2020-08-27',
});

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

    const { sessionId, orderId } = req.body;

    try {
        const order = await Order.findById(orderId)
        if (order) {
            if (sessionId) {
                // Récupérer la session de paiement
                const session = await stripe.checkout.sessions.retrieve(sessionId);

                // Vérifier si la session a un ID de charge
                if (!session.payment_intent) {
                    return res.status(400).json({ statusCode: 400, message: 'La session de paiement n\'a pas d\'ID de charge.' });
                }

                // Récupérer l'intention de paiement (payment_intent)
                const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

                // Vérifier si l'intention de paiement a un ID de charge
                if (!paymentIntent.charges.data.length) {
                    return res.status(400).json({ statusCode: 400, message: 'L\'intention de paiement n\'a pas d\'ID de charge.' });
                }

                // Récupérer l'ID de la charge
                const chargeId = paymentIntent.charges.data[0].id;

                // Créer un remboursement
                const refund = await stripe.refunds.create({
                    charge: chargeId,
                });

                // Update order with stripe
                const orderForUpdate = await Order.findById(orderId)
                orderForUpdate.isRefundAsked = true;
                orderForUpdate.isCancel = true;
                orderForUpdate.refundAskAt = new Date();
                orderForUpdate.cancelAt = new Date();

                orderForUpdate.stripeDetails.charge_id = chargeId;
                orderForUpdate.stripeDetails.refund_id = refund.id;

                const orderUpdate = await orderForUpdate.save();

                res.status(200).json({ order: orderUpdate });
            } else {
                if(order.isCancel) {
                    return res.status(200).json({ order: order });
                }
                // Update order with stripe
                order.isCancel = true;
                order.cancelAt = new Date();
                const updateResult = await order.save();
                const updateStatsAndStockProducts = async () => {
                    for (let product of updateResult.orderItems) {
                        await Product.updateOne({ _id: product._id }, {
                            $inc: {
                                countInStock: product.quantity,
                                "stats.totalSellInAwait": product.quantity - (product.quantity * 2),
                            }
                        });
                    }
                }
                await updateStatsAndStockProducts();
                return res.status(200).json({ order: updateResult });
            }
        } else {
            return res.status(404).json({ statusCode: 404, message: "This order is not found" });
        }

    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error });
    }
}

export default handler;
