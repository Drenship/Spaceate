import mongoose, { Document } from "mongoose";
mongoose.set('strictQuery', true);

interface IReview extends Document {
    user: mongoose.Schema.Types.ObjectId;
    product: mongoose.Schema.Types.ObjectId;
    rating: number;
    title: string;
    comment: string;
    helpfulVotes: number;
}

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        helpfulVotes: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);