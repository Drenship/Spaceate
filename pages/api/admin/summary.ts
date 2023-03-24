import { getSession } from 'next-auth/react';
import Order from '@libs/models/Order';
import Product from '@libs/models/Product';
import User from '@libs/models/User';
import db from '@libs/database/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';
import { authSessionMiddleware } from '@libs/Middleware/Api.Middleware.auth-session';

const last24Hours = () => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return { $gte: oneDayAgo };
};

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

    try {        
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

        salesData.sort((a, b) => {
            const toDate = (dateString: string) => {
                const [datePart, hourPart] = dateString.split(':');
                return new Date(`${datePart}T${hourPart}:00:00`);
            };
        
            const dateA = toDate(a._id);
            const dateB = toDate(b._id);
        
            return dateA.getTime() - dateB.getTime();
        });
    
    
        const countNewUsers = await User.countDocuments({ createdAt: last24Hours() });
        const countNewOrders = await Order.countDocuments({ createdAt: last24Hours() });
    
        const resultTotalPendingPaymentValue = await Order.aggregate([
            {
                $match: {
                    isPaid: false,
                    isCancel: false,
                    isRefund: false
                },
            },
            {
                $group: {
                    _id: null,
                    totalPendingPaymentValue: { $sum: '$totalPrice' },
                },
            },
        ]);
        const totalPendingPaymentValue = resultTotalPendingPaymentValue[0]?.totalPendingPaymentValue || 0;
    
        const totalCompletedPaymentsValue = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    isCancel: false,
                    isRefund: false,
                    createdAt: last24Hours(),
                },
            },
            {
                $group: {
                    _id: null,
                    totalCompletedPaymentValue: { $sum: '$totalPrice' },
                },
            },
        ]);
        const totalCompletedPaymentValue = totalCompletedPaymentsValue[0]?.totalCompletedPaymentValue || 0;
    
        await db.disconnect();
        res.send({
            ordersCount, productsCount, usersCount, ordersPrice,
            salesData,
            countNewUsers, countNewOrders, totalPendingPaymentValue, totalCompletedPaymentValue
        });
    } catch (error) {
        await db.disconnect();
        res.status(500).send({});
    }

};

export default handler;