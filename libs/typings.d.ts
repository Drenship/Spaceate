export interface Product {
    slug: string;
    name: string;
    categorie_products_id: string;
    description: string;
    main_image: string;
    images: string[];
    price: number;
    count_in_stock: number;
    price_in: string;
    rating: number;
    reviews: number;
}

export interface Commentaire {
    img: string
    name: string
    rating: string
    description: string
    date: string
}

export interface CartItem extends Product {
    quantity: number
}