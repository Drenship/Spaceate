import { NextApiRequest, NextApiResponse } from 'next';
import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';

const handlegetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.connect();

        const currentDate = new Date();

        const productsWithActivePromotions = await Product.find({
            promotions: {
                $elemMatch: {
                    isActive: true,
                    startDate: { $lte: currentDate },
                    endDate: { $gte: currentDate },
                },
            },
        })
            .sort({ 'promotions.discountPercentage': -1 })
            .limit(10);

        return res.send({ productsWithActivePromotions });
    } catch (error) {
        return res.send({ message: "Une erreur s'est produite lors de la récupération des produits en promotion", error });
    } finally {
        await db.disconnect();
    }
};

export default handlegetRequest;