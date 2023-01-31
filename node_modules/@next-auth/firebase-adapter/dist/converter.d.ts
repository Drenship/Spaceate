import type { FirestoreDataConverter } from "firebase/firestore";
interface GetConverterOptions {
    excludeId?: boolean;
}
export declare const getConverter: <Document_1 extends Record<string, unknown>>(options?: GetConverterOptions) => FirestoreDataConverter<Document_1>;
export {};
