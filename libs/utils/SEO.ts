import { CURRENCY } from "@config/index";
import { TypeProduct } from "@libs/typings";


export const generateProductJSONLD = (product: TypeProduct) => {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.main_image,
        "sku": product.slug,
        "offers": {
            "@type": "Offer",
            "priceCurrency": CURRENCY,
            "price": product.price,
        },
    };
};