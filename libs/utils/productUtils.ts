import { CURRENCY } from '@config/index';
import { TypeCartItem, TypeOrderProduct, TypeProduct, TypePromotions } from '@libs/typings';

export const activePromotion = (product: TypeProduct) => {
    const now = new Date();
    return product?.promotions?.filter(promo => {
        const startDate = new Date(promo.startDate);
        const endDate = new Date(promo.endDate);
        return now >= startDate && now <= endDate && promo.isActive === true;
    });
};

export const priceWithPromotion = (product: TypeProduct, activePromotion: TypePromotions[]): number => activePromotion && activePromotion[0] ? (product.price * (1 - (activePromotion[0]?.discountPercentage || 0) / 100)) : product.price

export const processOrderItems = (cartItems: TypeCartItem[]): TypeOrderProduct[] => cartItems.map((item: TypeCartItem) => ({
    _id: item._id,
    name: item.name,
    slug: item.slug,
    quantity: item.quantity,
    image: item.main_image,
    price: priceWithPromotion(item, activePromotion(item)),
    price_in: item.price_in,
    currency: item.currency ? item.currency : CURRENCY,
}));
