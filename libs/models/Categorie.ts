import mongoose, { Document } from "mongoose";

interface ISubCategory extends Document {
    name: string;
    slug: string;
}

interface ICategory extends Document {
    name: string;
    slug: string;
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

const SubCategorie = mongoose.model<ISubCategory>('SubCategorie', subCategorieSchema);


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
        subCategorie: [SubCategorie],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICategory>("Categorie", categorieSchema);