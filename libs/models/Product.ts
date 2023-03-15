import mongoose, { Document } from "mongoose";
import Categorie from "./Categorie";

mongoose.set('strictQuery', false)

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
            required: true
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
            totalSelled: {
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
/*
// test
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
 */


// Working functions
/*
productSchema.pre('save', function (this: IProduct & mongoose.Document<any, any, IProduct>, next) {
    const product = this;
    // On ne peut pas faire de l'async/await ici car la fonction doit être synchrone
    // On doit donc utiliser le callback next() à la place de l'await
    if (product.isModified('name')) {
        product.slug = slugify(product.name, { lower: true });
    }

    if (product.isModified('categorie') || product.isModified('subCategorie')) {
        const categorie = Categorie.findById(product.categorie);

        if (categorie) {
            const subCategorie = categorie.subCategorie.find(
                (subCategorie) => subCategorie._id.toString() === product.subCategorie.toString()
            );

            if (subCategorie) {
                next();
            } else {
                throw new Error(`SubCategorie with id ${product.subCategorie} not found in Categorie with id ${product.categorie}`);
            }
        } else {
            throw new Error(`Categorie with id ${product.categorie} not found`);
        }
    } else {
        next();
    }
});
*/


let findstart = 0;
productSchema.pre('find', function () {
    console.log(this instanceof mongoose.Query); // true
    findstart = Date.now();
});

productSchema.post('find', async function (result) {
    // Populate the categorie field
    const categorie = await Categorie.findById(result.categorie);

    if (categorie) {
        result.categorie = categorie
        result.subCategorie = categorie.subCategorie.filter(c => c._id === result.subCategorie);
    } else {
        console.log(`Could not find Categorie with id ${result.categorie}`)
    }

    console.log('find() product in ' + (Date.now() - findstart) + ' milliseconds');
});

export default mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)