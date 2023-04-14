import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import { TypeCartItem, TypeOrderProduct } from '@libs/typings';
import { processOrderItems } from '@libs/utils/productUtils';
import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import Product from '@libs/models/Product';
import User from '@libs/models/User';


const updateProductStats = async (cartItems: TypeCartItem[]) => {
    try {
        for (let product of cartItems) {
            const result = await Product.updateOne({ _id: product._id }, {
                $inc: {
                    countInStock: product.quantity - (product.quantity * 2),
                    "stats.totalSellInAwait": product.quantity
                }
            });
            console.log(result);
        }
    } catch (err) {
        console.error(err);
    }
}

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { user, shippingAddress, sameAddress, billingAddress, shippingMethode } = req.body;

        await db.connect();
        const getUser = await User.findById(user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const cartItems = getUser.cart.map((c: TypeCartItem) => ({ ...c.productId, quantity: c.quantity, cart_id: c._id }))
        const orderItems: TypeOrderProduct[] = processOrderItems(cartItems)

        const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const taxPrice = orderItems.reduce((acc, item) => acc + (item.price - item.priceHT) * item.quantity, 0);
        const shippingPrice = shippingMethode.shipping_rate_data.fixed_amount.amount / 100;
        const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // create order
        const newOrder = new Order({
            user: user._id,
            orderItems: orderItems,
            shippingAddress: shippingAddress,
            billingAddress: sameAddress ? shippingAddress : billingAddress,
            paymentMethod: " ",
            itemsPrice: itemsPrice,
            shippingPrice: shippingPrice,
            taxPrice: taxPrice,
            totalPrice: totalPrice + shippingPrice,
            shippingMethode: shippingMethode.shipping_rate_data
        })
        const order = await newOrder.save();

        // update product stats
        await updateProductStats(cartItems);

        // update user

        getUser.orders.push(order._id);
        getUser.cart.set([]);
        await getUser.save();

        return res.send({ message: 'Order created successfully', data: order });
    } catch (err) {
        return res.status(500).send({ err: err, message: 'An error has occurred' });
    } finally {
        await db.disconnect();
    }
};

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

export default handler;
