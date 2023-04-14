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
        const { user, shippingAddress, billingAddress, items: cartItems } = req.body;

        const orderItems: TypeOrderProduct[] = processOrderItems(cartItems)

        await db.connect();
        // create order
        const newOrder = new Order({
            user: user._id,
            orderItems: orderItems,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress,
            paymentMethod: " ",
            itemsPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: 0,
        })
        const order = await newOrder.save();

        // update product stats
        await updateProductStats(cartItems);

        // update user
        const getUser = await User.findById(user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
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
