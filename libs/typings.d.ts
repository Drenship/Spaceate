
interface Address {
    _id?:string;
    fullName: string | null,
    streetAddress: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    phone: string | null;
    addressType: 'shipping' | 'billing'
    isDefault: boolean;
}

interface CartItem {
    _id: string;
    productId: Types.ObjectId;
    quantity: number;
}

interface WishlistItem {
    _id: string;
    productId: Types.ObjectId;
}

interface Review {
    _id: string;
    reviewId: Types.ObjectId;
}

interface SearchHistoryItem {
    _id: string;
    query: string;
    date: Date;
}

interface RecentlyViewedItem {
    _id: string;
    productId: Types.ObjectId;
    date: Date;
}

interface Security {
    code: string;
    codeEndDate: Date;
    _notif_connect: boolean;
    _2fa: boolean;
    _2fa_type: 'email' | 'phone';
    login_history: {
        ip: string | null;
        location: string | null;
        date: Date;
    }[];
}

export interface TypeUser {
    _id: string;
    name: string;
    image: string | null,
    gender: 'male' | 'female' | 'other' | 'preferNotToSay' | 'unknown';
    email: string;
    email_is_verified: boolean;
    password: string;
    isAdmin: boolean;
    addresses: Address[];
    cart: CartItem[];
    wishlist: WishlistItem[];
    orders: TypeOrder[];
    reviews: Review[];
    searchHistory: string[];
    recentlyViewed: RecentlyViewedItem[];
    security: Security;
    createdAt: Date;
    updatedAt: Date;
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
    reviews: TypeCommentaire[];
    advancePrice: {
        initialCost: number;
        tva: number;
        marge: number;
    };
    stats: {
        totalSelled: number;
    };
    isFeatured: boolean;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface TypeCartItem extends TypeProduct {
    quantity: number;
    outOfStock?: boolean; // rupture de stock
    outOfQuantity?: boolean; // quantité demandée non disponible mais pas en rupture
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
    stripeDetails?: {
        session_id: string;
        customer_id: string;
        payment_intent_id: string;
        refund_id: string;
        charge_id: string;
    },
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
    isRefundAsked: boolean;
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