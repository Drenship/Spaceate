import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderItems: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                name: { type: String, required: true },
                slug: { type: String, required: false },
                quantity: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                price_in: { type: String, required: false },
            }
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            address2: { type: String, required: false },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: { type: String, required: true },
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        taxPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        paymentResultStripe: { type: Object },
        isPaid: { type: Boolean, required: true, default: false },
        isDelivered: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        deliveredAt: { type: Date },
    },
    {
        strict: false,
        timestamps: true,
    }
);

mongoose.set('strictQuery', false);


let findstart = 0;
orderSchema.pre('find', function () {
    console.log(this instanceof mongoose.Query); // true
    findstart = Date.now();
});

orderSchema.post('find', async function (result) {
    // Populate the categorie field
    console.log('find() order in ' + (Date.now() - findstart) + ' milliseconds', result);
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);