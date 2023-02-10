import mongoose from 'mongoose';

const connection = {};

async function connect() {

    if (!process.env.MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
        )
    }

    if (connection.isConnected) {
        console.log('already connected');
        return;
    }

    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            console.log('use previous connection');
            return;
        }
        await mongoose.disconnect();
    }

    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log('new connection');
    connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
    if (connection.isConnected) {
        if (process.env.NODE_ENV === 'production') {
            await mongoose.disconnect();
            connection.isConnected = false;
        }
        console.log('not disconnected');
    }
    console.log('not connect');
}

function convertDocToObj(doc) {
    if (Array.isArray(doc)) {
        return doc.map(item => convertDocToObj(item));
    }

    if (doc instanceof Object) {
        doc._id = doc._id.toString();
        doc.createdAt = doc?.createdAt?.toString() || "";
        doc.updatedAt = doc?.updatedAt?.toString() || "";

        for (const key in doc) {
            if (doc.hasOwnProperty(key)) {
                if (Array.isArray(doc[key]) || doc[key] instanceof Object) {
                    doc[key] = convertDocToObj(doc[key]);
                }
            }
        }
    }

    return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;