import { getSession } from 'next-auth/react';
import Order from '@libs/models/Order';
import Product from '@libs/models/Product';
import User from '@libs/models/User';
import db from '@libs/database/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    
    if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).send('signin required');
    }

    await db.connect();

    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    const ordersPriceGroup = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                isRefund: false,
                isCancel: false
            }
        },
        {
            $group: {
                _id: null,
                sales: { $sum: '$totalPrice' },
            },
        },
    ]);
    const ordersPrice = ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

    const salesData = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                isRefund: false,
                isCancel: false
            }
        },
        {
            $addFields: {
                createdAtInterval: {
                    $floor: {
                        $divide: [
                            { $subtract: ['$createdAt', new Date('1970-01-01')] },
                            12 * 60 * 60 * 1000 // 12 heures en millisecondes
                        ]
                    }
                }
            }
        },
        {
            $addFields: {
                createdAtRounded: {
                    $dateToString: {
                        format: '%Y-%m-%d:%H', // Format YY:MM:DD:HH
                        date: {
                            $add: [
                                new Date('1970-01-01'),
                                { $multiply: ['$createdAtInterval', 12 * 60 * 60 * 1000] }
                            ]
                        },
                        timezone: 'UTC' // Utilisez le fuseau horaire souhaité
                    }
                }
            }
        },
        {
            $group: {
                _id: '$createdAtRounded',
                totalSales: { $sum: '$totalPrice' }
            }
        }
    ]).sort({ createAt: 1 });

    console.log(salesData)

    await db.disconnect();
    res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
};

export default handler;