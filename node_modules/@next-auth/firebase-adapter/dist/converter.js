"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConverter = void 0;
const firestore_1 = require("firebase/firestore");
const isTimestamp = (value) => typeof value === "object" && value !== null && value instanceof firestore_1.Timestamp;
const getConverter = (options) => ({
    // `PartialWithFieldValue` implicitly types `object` as `any`, so we want to explicitly type it
    toFirestore(object) {
        const document = {};
        Object.keys(object).forEach((key) => {
            if (object[key] !== undefined) {
                document[key] = object[key];
            }
        });
        return document;
    },
    // We need to explicitly type `snapshot` since it uses `DocumentData` for generic type
    fromFirestore(snapshot) {
        if (!snapshot.exists()) {
            return snapshot;
        }
        let document = snapshot.data();
        if (!(options === null || options === void 0 ? void 0 : options.excludeId)) {
            document = {
                ...document,
                id: snapshot.id,
            };
        }
        for (const key in document) {
            const value = document[key];
            if (isTimestamp(value)) {
                document = {
                    ...document,
                    [key]: value.toDate(),
                };
            }
        }
        return document;
    },
});
exports.getConverter = getConverter;
