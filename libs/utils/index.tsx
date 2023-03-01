export function generateUUID() {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function textToSLug(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export function replaceURL(url: string) {
    if (!url || url === "") return "";
    return url.startsWith("/") ? url : `/${url}`;
}

export function UTCStringToDate(utcString: string) {
    const date = new Date(utcString);
    const dateForma = navigator.language || 'fr-FR'
    return date.toLocaleDateString(dateForma);
};

export async function teinteDeLimage(urlImage: string): Promise<string> {
    // Créez un objet Image
    const image = new Image();

    // Attendez que l'image soit chargée
    const imageLoaded = new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });

    // Spécifiez l'URL de l'image que vous voulez récupérer
    image.src = urlImage;

    // Attendez que l'image soit chargée
    await imageLoaded;

    if (!imageLoaded) {
        console.log("error of loading image");
        return "";
    }

    // Créez un canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.log("error of canvas 2d context");
        return "";
    }

    // Définissez la taille du canvas pour correspondre à la taille de l'image
    canvas.width = image.width;
    canvas.height = image.height;

    // Dessinez l'image sur le canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Obtenez les données de l'image sous forme de tableau de pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Calculez la couleur moyenne de tous les pixels de l'image
    let totalRed = 0;
    let totalGreen = 0;
    let totalBlue = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        totalRed += pixels[i];
        totalGreen += pixels[i + 1];
        totalBlue += pixels[i + 2];
    }
    const averageRed = totalRed / (pixels.length / 4);
    const averageGreen = totalGreen / (pixels.length / 4);
    const averageBlue = totalBlue / (pixels.length / 4);

    // Créez une chaîne de caractères CSS pour la couleur moyenne
    const color = `rgb(${averageRed}, ${averageGreen}, ${averageBlue})`;

    // Retournez la couleur moyenne
    return color;
}

export function querySecurMongoDB(str: string): [string, boolean] {
    const regex = /^[a-zA-Z0-9_*]+$/;
    const strUpdate = str.replace(/[^a-zA-Z0-9] /g, '').replace(/[$]/g, '')

    if (!regex.test(strUpdate)) {
        console.log(strUpdate, "La chaîne de caractères contient des caractères spéciaux qui ne sont pas autorisés pour MongoDB");
        return [strUpdate, false];
    }

    return [strUpdate, true];
}