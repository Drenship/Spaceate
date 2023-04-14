import mongoose, { Document } from "mongoose";
import "@libs/models/Categorie";
mongoose.set('strictQuery', true);

interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    categorie: mongoose.Schema.Types.ObjectId;
    subCategorie: string;
    main_image: string;
    images: string[];
    price: number;
    price_in: string;
    promotions: [{
        startDate: Date;
        endDate: Date;
        discountPercentage: number;
        isActive: boolean;
    }];
    advancePrice: {
        initialCost: number;
        tva: number;
        marge: number;
    };
    rating: number;
    numReviews: number;
    reviews: [mongoose.Schema.Types.ObjectId];
    currency: string;
    tags: [string];
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
            trim: true,
            match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // example regex for slug validation
        },
        tags: [String],
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
        promotions: [
            {
                startDate: {
                    type: Date,
                    required: true,
                },
                endDate: {
                    type: Date,
                    required: true,
                },
                discountPercentage: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 100,
                },
                isActive: {
                    type: Boolean,
                    default: true,
                },
            },
        ],
        currency: {
            type: String,
            required: true,
            default: "EUR",
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
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
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

productSchema.index({
    slug: 1,
    name: 1,
    price: 1,
    categorie: 1,
    subCategorie: 1,
});

productSchema.plugin(require('mongoose-autopopulate'));

if(process.env.NODE_ENV === 'development') {
    let findstart = 0;
    productSchema.pre('find', function () {
        console.log(this instanceof mongoose.Query); // true
        findstart = Date.now();
    });
    
    productSchema.post('find', async function (result) {
        console.log('find() product in ' + (Date.now() - findstart) + ' milliseconds');
    });
}

export default mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)