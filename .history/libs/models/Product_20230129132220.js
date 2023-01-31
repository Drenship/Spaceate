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

productSchema.pre('validate', function () {
    console.log('this gets printed first');
});

productSchema.post('validate', function () {
    console.log('this gets printed second');
});

productSchema.pre('save', function () {
    console.log('this gets printed third');
});

productSchema.post('save', function () {
    console.log('this gets printed fourth');
});

let findstart = 0;
productSchema.pre('find', function () {
    console.log(this instanceof mongoose.Query); // true
    findstart = Date.now();
});

productSchema.post('find', function (result) {
    console.log(this instanceof mongoose.Query); // true
    // prints returned documents
    console.log('find() returned ' + JSON.stringify(result));
    // prints number of milliseconds the query took
    console.log('find() took ' + (Date.now() - findstart) + ' milliseconds');
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;