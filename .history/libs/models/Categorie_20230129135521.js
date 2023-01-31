import mongoose from "mongoose";

const subCategorieSchema = new Schema({ name: String });
const SubCategorie = mongoose.models.SubCategorie || mongoose.model('SubCategorie', subCategorieSchema);

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

const Categorie = mongoose.models.Categorie || mongoose.model("Categorie", categorieSchema);
export default Categorie;