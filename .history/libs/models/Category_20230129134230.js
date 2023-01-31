import mongoose from "mongoose";

const subCategorySchema = new Schema({ name: String });
const SubCategory = mongoose.model('subCategorySchema', subCategorySchema);

const categorySchema = new mongoose.Schema(
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
        subCategory: [subCategorySchema],
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;