import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { generateUUID } from "@libs/utils";
import { storage } from '@local-firebase';

interface uploadFile {
    file: File | null,
    path: string
}

export const uploadFile = async ({ file, path }: uploadFile) => {
    return new Promise((resolve, reject) => {
        console.log(file)
        if (file == null || !path) {
            reject(false);
            return;
        }
        try {
            const imageRef = ref(storage, `${path}/${generateUUID()}`);
            uploadBytes(imageRef, file)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref)
                        .then((url) => resolve(url))
                        .catch(() => reject(false))
                })
                .catch(() => reject(false))
        } catch (error) {
            reject(false)
        }
    });
};

//const imagesListRef = ref(storage, "products/");
/* useEffect(() => {
    listAll(imagesListRef).then((response) => {
        setImageUrls([])
        response.items.forEach((item) => {
            console.log("response", item)
            getDownloadURL(item).then((url) => {
                setImageUrls((prev) => [...prev, url]);
            });
        });
    });
}, []); */
