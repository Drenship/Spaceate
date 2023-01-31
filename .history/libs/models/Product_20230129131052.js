import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true, 
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        subCategory: {
            type: String,
            default: null,
            required: true
        },
        main_image: {
            type: String,
            required: true, 
            trim: true
        },
        images: [String],
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        price_in: {
            type: String,
            required: true,
            default: "kg" | "unité"
        },
        advancePrice: {
            initialCost: {
                type: Number,
                min: 0,
            },
            tva: {
                type: Number,
                min: 0,
            },
            marge: {
                type: Number,
                min: 0,
            }
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        numReviews: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        countInStock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;