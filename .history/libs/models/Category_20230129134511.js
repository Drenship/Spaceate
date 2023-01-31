import mongoose from "mongoose";

const subCategorySchema = new Schema({ name: String });
const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);

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
        subCategory: [SubCategory],
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;