import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: [true, 'We need a email for create account.'],
            unique: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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
                default: ""
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
        timestamps: true,
    }
);


export default mongoose.models.User || mongoose.model('User', userSchema);