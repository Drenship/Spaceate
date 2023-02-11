import mongoose, { Document } from "mongoose";

interface ISubCategory extends Document {
    name: String;
    slug: String;
}

interface ICategory extends Document {
    name: String;
    slug: String;
    subCategorie: ISubCategory[]
}

const subCategorieSchema = new mongoose.Schema({
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
});

const categorieSchema = new mongoose.Schema(
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
        subCategories: [subCategorieSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Categorie || mongoose.model<ICategory>("Categorie", categorieSchema);