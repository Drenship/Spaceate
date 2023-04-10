import mongoose, { Document } from "mongoose";

interface IDailyStats {
    date: Date;
    totalSellInAwait: number;
    totalSelled: number;
    totalExpired: number;
    totalViews: number;
}

interface IProductStats extends Document {
    product: mongoose.Schema.Types.ObjectId;
    globalStats: IDailyStats;
    dailyStats: [IDailyStats];
}

const dailyStatsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    totalSellInAwait: {
        type: Number,
        min: 0,
        default: 0,
    },
    totalSelled: {
        type: Number,
        min: 0,
        default: 0,
    },
    totalExpired: {
        type: Number,
        min: 0,
        default: 0,
    },
    totalViews: {
        type: Number,
        min: 0,
        default: 0,
    },
    uniqueViews: {
        type: Number,
        min: 0,
        default: 0,
    },
    addToCart: {
        type: Number,
        min: 0,
        default: 0,
    },
    purchases: {
        type: Number,
        min: 0,
        default: 0,
    },
});


const productStatsSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            unique: true,
        },
        globalStats: {
            type: dailyStatsSchema,
            required: true,
            default: () => ({}),
        },
        dailyStats: [dailyStatsSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.ProductStats || mongoose.model<IProductStats>("ProductStats", productStatsSchema);