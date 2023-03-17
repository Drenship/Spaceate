export interface TypeUser {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    createdAt: Date;
}

export interface TypeSubCategories {
    _id: string;
    name: string;
    slug: string;
}

export interface TypeCategorie {
    _id: string;
    name: string;
    slug: string;
    subCategories: TypeSubCategories[];
}

export interface TypeProduct {
    _id: string;
    slug: string;
    name: string;
    categorie: TypeCategorie;
    subCategorie: TypeSubCategories | string;
    description: string;
    main_image: string;
    images: string[];
    price: number;
    countInStock: number;
    price_in: string;
    rating: number;
    numReviews: number;
    reviews: TypeCommentaire[]
    advancePrice: {
        initialCost: number
        tva: number
        marge: number
    };
    stats: {
        totalSelled: number
    };
    isFeatured: boolean;
    isPublished: boolean;
}

export interface TypeCartItem extends TypeProduct {
    quantity: number
}

export interface TypeCommentaire {
    _id: string
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

export interface TypeOrderProduct {
    _id: string;
    name: string;
    slug: string;
    quantity: number;
    image: string;
    price: number;
    price_in: string;
}

export interface TypeShippingAddress {
    fullName: string;
    address: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface TypeOrder {
    _id: string;
    user: TypeUser;
    stripe_pay_id?: string;
    orderItems: TypeOrderProduct[];
    shippingAddress: TypeShippingAddress;
    blindingAdress?: TypeShippingAddress;
    shippingTrack?: {
        id?: string;
        service?: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    paymentResultStripe?: any;
    isCancel: boolean;
    isPaid: boolean;
    isSended: boolean;
    isDelivered: boolean;
    isRefund: boolean;
    cancelAt?: Date;
    paidAt?: Date;
    sendedAt?: Date;
    deliveredAt?: Date;
    refundAskAt?: Date;
    refundAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

export interface FileInfo {
    name: string;
    size: number;
    url: string;
    mimetype: any,
    uploadedAt: Date;
}