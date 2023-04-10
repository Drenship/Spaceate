import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { cartState } from "@atoms/cartState"
import { useRouter } from 'next/dist/client/router';
import { CART_ADD_ITEM, setCartState } from '@atoms/setStates/setCartState';
import { fixedPriceToCurrency, replaceURL } from '@libs/utils';
import Rating from '@components/contents/Rating';
import { TypeProduct } from '@libs/typings';


interface BestsellerCardProps {
    product: TypeProduct
}
const BestsellerCard: React.FC<BestsellerCardProps> = ({ product }) => {

    const router = useRouter()
    const [cartItem, setCartItem] = useRecoilState(cartState)

    const isOutOfStock = useMemo<boolean>(() => product.countInStock <= 0, [product]);

    const addItemsToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (isOutOfStock) {
            return alert('le produit est en rupture de stock');
        }

        let newProductCart = { ...product }
        newProductCart.quantity = 1

        setCartState({
            action: CART_ADD_ITEM,
            product: newProductCart,
            cartItem: cartItem,
            setCartItem: setCartItem
        })

        router.push('/cart')
    }


    const activePromotion = useMemo(() => {
        const now = new Date();
        return product?.promotions?.filter(promo => {
            const startDate = new Date(promo.startDate);
            const endDate = new Date(promo.endDate);
            return now >= startDate && now <= endDate && promo.isActive === true;
        });
    }, [product]);

    return (
        <Link href={`/product/${product.slug}`} className="flex flex-col items-start justify-center w-full overflow-hidden bg-white rounded-md shadow-md group button-click-effect">
            <div className="relative">

                <div className='relative aspect-[3/2] overflow-hidden'>
                    <div className='absolute z-[1] w-full h-full group-hover:bg-black/10 duration-300 transition-color' />
                    <img className="object-cover w-full h-full transition-transform duration-300 scale-100 group-hover:scale-110" src={replaceURL(product.main_image)} alt="watch" />
                </div>

                <button
                    className="z-10 top-3 right-3 absolute p-3.5 shadow-md text-gray-600 disabled:cursor-no-drop hover:text-gray-500 flex justify-center items-center bg-white rounded-full button-click-effect"
                    disabled={isOutOfStock}
                    onClick={addItemsToCart}
                >
                    <svg className="fill-stroke" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.25 6.875V5.625C6.25 4.63044 6.64509 3.67661 7.34835 2.97335C8.05161 2.27009 9.00544 1.875 10 1.875V1.875C10.9946 1.875 11.9484 2.27009 12.6517 2.97335C13.3549 3.67661 13.75 4.63044 13.75 5.625V6.875M3.125 6.875C2.95924 6.875 2.80027 6.94085 2.68306 7.05806C2.56585 7.17527 2.5 7.33424 2.5 7.5V15.9375C2.5 17.1187 3.50625 18.125 4.6875 18.125H15.3125C16.4937 18.125 17.5 17.1676 17.5 15.9863V7.5C17.5 7.33424 17.4342 7.17527 17.3169 7.05806C17.1997 6.94085 17.0408 6.875 16.875 6.875H3.125Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path d="M6.25 8.75V9.375C6.25 10.3696 6.64509 11.3234 7.34835 12.0267C8.05161 12.7299 9.00544 13.125 10 13.125C10.9946 13.125 11.9484 12.7299 12.6517 12.0267C13.3549 11.3234 13.75 10.3696 13.75 9.375V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className='px-2 py-4 space-y-3'>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-lg font-medium leading-none text-gray-800">{product.name}</p>
                        </div>
                        <div className="flex space-x-0.5 text-lg font-semibold leading-none text-right text-gray-600">
                            {
                                activePromotion && activePromotion[0] ? (
                                    <>
                                        <span className='text-sm line-through'>{product.price}€</span>
                                        <span className='text-red-600'>{fixedPriceToCurrency(product.price * (1 - (activePromotion[0]?.discountPercentage || 0) / 100))}</span>
                                        <span className='text-sm'>/{product.price_in}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{fixedPriceToCurrency(product.price)}</span>
                                        <span className='text-sm'>/{product.price_in}</span>
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex justify-start space-x-1">
                        <Rating rating={product.rating} />
                        <span>{product.numReviews} avis</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default BestsellerCard;