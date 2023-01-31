import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}


async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        try { 
            cached.promise = connect(MONGODB_URI, {
                bufferCommands: false,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then((mongoose) => {
                return mongoose
            }).catch((error) => {
                throw new Error('mongoose connect catch : ' + error)
            });
        } catch (error) {
            throw new Error('try catch error : ' + error)
        }
    }

    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnect;