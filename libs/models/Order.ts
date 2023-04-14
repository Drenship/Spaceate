import mongoose from 'mongoose';
import "@libs/models/User";

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        stripeDetails: {
            session_id: { type: String, required: false },
            customer_id: { type: String, required: false },
            payment_intent_id: { type: String, required: false },
            refund_id: { type: String, required: false },
            charge_id: { type: String, required: false },
            
            paymentResultStripe: { type: Object },
        },

        orderItems: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                name: { type: String, required: true },
                slug: { type: String, required: false },
                quantity: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                price_in: { type: String, required: false },
                currency: { type: String, required: true, default: "eur" },

                //tva: { type: Number, required: false },
                //priceHT: { type: Number, required: false },
                //priceTTC: { type: Number, required: false },
            }
        ],

        shippingAddress: {
            fullName: { type: String, required: true },
            streetAddress: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: false, trim: true },
        },

        billingAddress: {
            fullName: { type: String, required: true },
            streetAddress: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: false, trim: true },
        },

        shippingTrack: {
            id: { type: String, required: false },
            service: { type: String, required: false },
        },

        paymentMethod: { type: String, required: true },
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        taxPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },

        isCancel: { type: Boolean, required: true, default: false },
        isPaid: { type: Boolean, required: true, default: false },
        isSended: { type: Boolean, required: true, default: false },
        isDelivered: { type: Boolean, required: true, default: false },
        isRefund: { type: Boolean, required: true, default: false },

        isRefundAsked: { type: Boolean, required: true, default: false },

        cancelAt: { type: Date },
        paidAt: { type: Date },
        sendedAt: { type: Date },
        deliveredAt: { type: Date },
        refundAskAt: { type: Date },
        refundAt: { type: Date },
    },
    {
        strict: false,
        timestamps: true,
    }
);

orderSchema.set('strictQuery', false);

if (process.env.NODE_ENV === 'development') {
    let findstart = 0;
    orderSchema.pre('find', function () {
        console.log(this instanceof mongoose.Query); // true
        findstart = Date.now();
    });

    orderSchema.post('find', async function (result) {
        console.log('find() order in ' + (Date.now() - findstart) + ' milliseconds');
    });
}

export default mongoose.models.Order || mongoose.model('Order', orderSchema);