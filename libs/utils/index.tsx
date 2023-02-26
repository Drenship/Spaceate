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
    return url.startsWith("/") ? url : `/${url}`;
}

export function UTCStringToDate(utcString: string) {
    const date = new Date(utcString);
    const dateForma = navigator.language || 'fr-FR'
    return  date.toLocaleDateString(dateForma);
};