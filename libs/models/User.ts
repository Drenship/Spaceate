import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other', 'preferNotToSay', 'unknown'],
            default: 'unknown'
        },
        email: {
            type: String,
            required: [true, 'We need a email for create account.'],
            unique: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        email_is_verified: {
            type: Boolean,
            required: true,
            default: false
        },
        emailVerificationToken: { 
            type: String, 
        },
        emailVerificationTokenExpires: { 
            type: Date 
        },

        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },

        addresses: [
            {
                fullName: {
                    type: String,
                    required: true
                },
                streetAddress: {
                    type: String,
                    required: true
                },
                city: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                },
                postalCode: {
                    type: String,
                    required: true
                },
                country: {
                    type: String,
                    required: true
                },
                phone: {
                    type: String,
                    required: true
                },
                addressType: {
                    type: String,
                    enum: ['shipping', 'billing'],
                    required: true
                },
                isDefault: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        cart: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                }
            }
        ],
        wishlist: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                }
            }
        ],
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            }
        ],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review'
            }
        ],
        searchHistory: [
            {
                query: {
                    type: String,
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        recentlyViewed: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        security: {
            code: {
                type: String,
                default: ""
            },
            codeEndDate: {
                type: Date,
                default: Date.now
            },
            _notif_connect: {
                type: Boolean,
                default: false
            },
            _2fa: {
                type: Boolean,
                default: false
            },
            _2fa_type: {
                type: String,
                enum: ["email", "phone"],
                default: "email"
            },
            login_history: [{
                ip: {
                    type: String,
                    default: null
                },
                location: {
                    type: String,
                    default: null
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }],
        },
    },
    {
        strict: true,
        timestamps: true,
    }
);

userSchema.index({ emailVerificationToken: 1 }, { unique: true, partialFilterExpression: { emailVerificationToken: { $exists: true } } });

userSchema.set('strictQuery', true)


export default mongoose.models.User || mongoose.model('User', userSchema);