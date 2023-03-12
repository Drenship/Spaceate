import mongoose from 'mongoose';

const orderTestSchema = new mongoose.Schema(
    {
        object: { type: Object },
    },
    {
        timestamps: true,
    }
);


export default mongoose.models.OrderTest || mongoose.model('OrderTest', orderTestSchema);