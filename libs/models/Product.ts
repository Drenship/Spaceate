import mongoose, { Document } from "mongoose";
import "@libs/models/Categorie";

interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    categorie: string;
    subCategorie: string;
    main_image: string;
    images: string[];
    price: number;
    price_in: string;
    advancePrice: {
        initialCost: number;
        tva: number;
        marge: number;
    };
    rating: number;
    numReviews: number;
    reviews: [];
    countInStock: number;
    isFeatured: boolean;
    isPublished: boolean;
}

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        categorie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categorie',
            required: true,
            autopopulate: true
        },
        subCategorie: {
            type: mongoose.Schema.Types.ObjectId,
            subRef: 'Categorie.subCategories',
            required: true
        },
        description: {
            type: String,
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
            default: "kg"
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
            min: 0,
            max: 5,
            default: 0,
        },
        numReviews: {
            type: Number,
            min: 0,
            default: 0
        },
        reviews: [],
        countInStock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        stats: {
            // product with pending payment
            totalSellInAwait: {
                type: Number,
                min: 0,
                default: 0
            },
            // product payed
            totalSelled: {
                type: Number,
                min: 0,
                default: 0
            },
            // product périmé / lost
            totalExpired: {
                type: Number,
                min: 0,
                default: 0
            },
            // product vue
            totalViews: {
                type: Number,
                min: 0,
                default: 0
            },
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        isPublished: {
            type: Boolean,
            default: false
        },
    },
    {
        strict: false,
        timestamps: true,
    }
);


productSchema.set('strictQuery', false)

productSchema.index({
    slug: 1,
    name: 1,
    price: 1,
    categorie: 1,
    subCategorie: 1,
});

productSchema.plugin(require('mongoose-autopopulate'));

let findstart = 0;
productSchema.pre('find', function () {
    console.log(this instanceof mongoose.Query); // true
    findstart = Date.now();
});

productSchema.post('find', async function (result) {
    console.log('find() product in ' + (Date.now() - findstart) + ' milliseconds');
});

export default mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)