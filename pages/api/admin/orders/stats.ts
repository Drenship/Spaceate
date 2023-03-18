import { getSession } from 'next-auth/react';
import Order from '@libs/models/Order';
import Product from '@libs/models/Product';
import User from '@libs/models/User';
import db from '@libs/database/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    authSessionMiddleware({ authOnly: true, adminOnly: true })(req, res, () => {
        switch (req.method) {
            case 'GET':
                return handleGetRequest(req, res);
            default:
                return res.status(400).send({ message: 'Method not allowed' });
        }
    })
};


const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    await db.connect();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const produitMostSelled = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                isRefund: false,
                isCancel: false,
                createdAt: { $gte: sevenDaysAgo },
            },
        },
        {
            $unwind: '$orderItems',
        },
        {
            $group: {
                _id: '$orderItems._id',
                name: { $first: '$orderItems.name' },
                image: { $first: '$orderItems.image' },
                totalQuantity: { $sum: '$orderItems.quantity' },
                totalPrice: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
            },
        },
        {
          $sort: { totalPrice: -1 },
        },{
            $limit: 5,
        }
    ]).sort({ createAt: 1 });


    const salesData = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                isRefund: false,
                isCancel: false,
                createdAt: {
                    $gte: new Date((new Date()) - 7 * 24 * 60 * 60 * 1000) // 7 derniers jours
                }
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
                totalPrice: { $sum: '$totalPrice' },
                numberOfOrders: { $sum: 1 }
            }
        }
    ]).sort({ createAt: 1 });

    await db.disconnect();
    res.send({ salesData, produitMostSelled });
};

export default handler;