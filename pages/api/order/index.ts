import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';
import Order from '@libs/models/Order';
import db from '@libs/database/dbConnect';
import { TypeCartItem } from '@libs/typings';
import Product from '@libs/models/Product';

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
    try {
        const cartItems = req.body.items

        const orderItems: TypeCartItem[] = cartItems.map((item: TypeCartItem) => ({
            _id: item._id,
            name: item.name,
            slug: item.slug,
            quantity: item.quantity,
            image: item.main_image,
            price: item.price,
            price_in: item.price_in
        }))

        await db.connect();
        const newOrder = new Order({
            user: req.body.user._id,
            orderItems: orderItems,
            shippingAddress: {
                fullName: " ",
                address: " ",
                address2: "",
                city: " ",
                postalCode: " ",
                country: " ",
            },
            paymentMethod: " ",
            itemsPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: 0,
        })
        const order = await newOrder.save();
        // update product stats

        const orderItemsUpdatesProduct = cartItems.map((item: TypeCartItem) => ({
            filter: { _id: item._id },
            update: {
                $inc: {
                    countInStock: item.quantity - (item.quantity * 2),
                    "stats.totalSellInAwait": item.quantity
                }
            }
        }))

        const updateProducts = async () => {
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
        await updateProducts();

        await db.disconnect();
        res.send({ message: 'Order created successfully', data: order });
    } catch (err) {
        res.status(500).send({ err: err, message: 'An error has occurred' });
    }
};

export default handler;
