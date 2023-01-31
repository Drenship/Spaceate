import db from '@libs/database/dbConnect';
import Product from '@libs/models/Product';

const handler = async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    await db.disconnect();
    res.send(product);
};

export default handler;