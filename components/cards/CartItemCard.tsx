"use client";

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link';

import { useNotifys } from '@libs/hooks/notify';
import { fixedPriceToCurrency, replaceURL } from '@libs/utils';
import { TypeCartItem } from '@libs/typings'

import InputNumber from '@components/inputs/InputNumber'
import BlurImage from '@components/contents/BlurImage'
import { activePromotion, priceWithPromotion } from '@libs/utils/productUtils';
import useUserStore from '@libs/hooks/modals/useUserStore';
import { toast } from 'react-hot-toast';

interface CartItemCardProps {
    product: TypeCartItem
}

const CartItemCard: React.FC<CartItemCardProps> = ({ product }) => {
    const useUser = useUserStore();

    const { pushNotify } = useNotifys();
    const [notify, setNotify] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity);

    const isOutOfStock = useMemo(() => product.countInStock <= 0, [product]);

    useEffect(() => {
        const updateItemToCart = () => {
            if (isOutOfStock) {
                return toast.error('le produit est en rupture de stock');
            }

            useUser.updateCartItemQuantity(product.cart_id, quantity)

            if (notify === false) {
                pushNotify({
                    title: product.name,
                    subTitle: "L'article a été mis a jour avec succès",
                    icon: "CART",
                    duration: 3
                })
                setNotify(true)
                setTimeout(() => {
                    setNotify(false)
                }, 3000)
            }
        }

        if (quantity !== product.quantity) updateItemToCart()

    }, [quantity]);

    const removeItemToCart = () => {

        useUser.removeFromCart(product.cart_id)

        pushNotify({
            title: "",
            subTitle: "L'article a été retiré avec succès",
            icon: "CART",
            duration: 5
        })
    }

    const activePromotionList = useMemo(() => activePromotion(product), [product]);
    const getPriceWithPromotion = useMemo(() => priceWithPromotion(product, activePromotionList), [product, activePromotionList]);

    return (
        <div className='w-full'>

            <div className='bg-[#fff] mx-auto max-w-[800px] mt-4 py-2 px-4 flex gap-6 items-center justify-between rounded-lg shadow-lg'>

                <div className='flex items-start justify-start space-x-5'>
                    <Link href={`/product/${product.slug}`}>
                        <div className='h-[100px] rounded-lg aspect-square object-cover relative overflow-hidden'>
                            <BlurImage
                                src={replaceURL(product.main_image)}
                            />
                        </div>
                    </Link>

                    <div>
                        <Link href={`/product/${product.slug}`}>
                            <div className='text-2xl font-bold'>{product.name}</div>
                        </Link>

                        <div className='flex flex-col items-start justify-between xs:hidden'>
                            <div className='text-2xl font-bold'>{(getPriceWithPromotion * product.quantity).toFixed(2)}€</div>
                            <div className="flex items-end mt-1 space-x-0.5 text-lg font-semibold leading-none text-right text-gray-600">
                                {
                                    activePromotionList && activePromotionList[0] ? (
                                        <>
                                            <span className='text-base line-through'>{fixedPriceToCurrency(product.price)}</span>
                                            <span className='text-xl text-red-600'>{fixedPriceToCurrency(getPriceWithPromotion)}</span>
                                            <span className='text-base'>/{product.price_in}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className='text-xl'>{fixedPriceToCurrency(product.price)}</span>
                                            <span className='text-base'>d/{product.price_in}</span>
                                        </>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex mt-5 space-x-2'>
                            <div>
                                <InputNumber
                                    min={0}
                                    max={product.countInStock}
                                    defaultValue={quantity}
                                    setUpdate={setQuantity}
                                />
                            </div>
                            <button
                                className='px-2 py-1 text-red-600 underline hover:text-red-700'
                                onClick={removeItemToCart}
                            >Supprimer</button>
                        </div>
                    </div>
                </div>

                <div className='flex-col items-end justify-between hidden xs:flex'>
                    <div className='text-2xl font-bold'>{(getPriceWithPromotion * product.quantity).toFixed(2)}€</div>
                    <div className="flex items-end mt-1 space-x-0.5 text-lg font-semibold leading-none text-right text-gray-600">
                        {
                            activePromotionList && activePromotionList[0] ? (
                                <>
                                    <span className='text-base line-through '>{fixedPriceToCurrency(product.price)}</span>
                                    <span className='text-xl text-red-600'>{fixedPriceToCurrency(getPriceWithPromotion)}</span>
                                    <span className='text-base'>/{product.price_in}</span>
                                </>
                            ) : (
                                <>
                                    <span className='text-xl'>{fixedPriceToCurrency(product.price)}</span>
                                    <span className='text-base'>d/{product.price_in}</span>
                                </>
                            )
                        }
                    </div>
                </div>

            </div>

        </div>
    )
}

export default CartItemCard;