import mongoose from 'mongoose';

const connection = {};

async function connect() {

    if (!process.env.MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
        )
    }

    if (connection.isConnected) {
        return;
    }

    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            return;
        }
        await mongoose.disconnect();
    }

    const db = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
    if (connection.isConnected) {
        if (process.env.NODE_ENV === 'production') {
            await mongoose.disconnect();
            connection.isConnected = false;
        }
    }
}

function convertDocToObj(doc) {
    if (Array.isArray(doc)) {
        return doc.map(convertDocToObj);
    }

    if (typeof doc === 'object' && doc !== null) {
        const newObj = {};

        for (const key in doc) {
            if (doc.hasOwnProperty(key)) {
                if (key === '_id') {
                    newObj[key] = doc[key].toString();
                } else if (key === 'createdAt' || key === 'updatedAt') {
                    newObj[key] = doc[key]?.toString() || "";
                } else if (Array.isArray(doc[key]) || doc[key] instanceof Object) {
                    newObj[key] = convertDocToObj(doc[key]);
                } else {
                    newObj[key] = doc[key];
                }
            }
        }
        return newObj;
    }
    return doc;
}


const db = { connect, disconnect, convertDocToObj };
export default db;