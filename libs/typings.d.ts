export interface TypeUser {
    _id: string
    name: string
    email: string
    isAdmin: string
}


export interface TypeSubCategorie {
    name: string;
}

export interface TypeCategorie {
    _id: string
    name: string;
    slug: string;
    subCategorie: SubCategorie[];
    createdAt: Date;
    updatedAt: Date;
}

export interface TypeProduct {
    //_id: string
    slug: string
    name: string
    categorie_products_id: string
    description: string
    main_image: string
    images: string[]
    price: number
    count_in_stock: number
    price_in: string
    rating: number
    reviews: number
}

export interface TypeCartItem extends TypeProduct {
    quantity: number
}

export interface TypeCommentaire {
    //_id: string
    img: string
    name: string
    rating: string
    description: string
    date: string
}

export interface TypeOrderItem {
    _id: string
    name: string
    quantity: number
    image: string
    price: number
}

export interface TypeOrder {
    _id: string
    user: string
    orderItems: TypeOrderItem[];
    shippingAddress: {
        fullName: string
        address: string
        city: string
        postalCode: string
        country: string
    }
    paymentMethod: string
    paymentResult: {
        id: string
        status: string
        email_address: string
    }
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
    isPaid: boolean
    isDelivered: boolean
    paidAt?: Date
    deliveredAt?: Date
}
