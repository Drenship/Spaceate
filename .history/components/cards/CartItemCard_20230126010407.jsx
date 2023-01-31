import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { cartState } from "@atoms/cartState"
import { setCartState, CART_ADD_ITEM, CART_REMOVE_ITEM } from "@atoms/setStates/setCartState"
import { useNotifys } from '@libs/hooks/notify';
import InputNumber from '@components/ui-ux/inputs/InputNumber'
import BlurImage from '@components/ui-ux/BlurImage'

export default function CartItemCard({ product }) {

    const { pushNotify } = useNotifys();
    const [quantity, setQuantity] = useState(product.quantity);
    const [cartItem, setCartItem] = useRecoilState(cartState)

    useEffect(() => {
        const updateItemToCart = () => {
            let newProductCart = { ...product }
            newProductCart.quantity = quantity

            setCartState({
                action: CART_ADD_ITEM,
                product: newProductCart,
                cartItem: cartItem,
                setCartItem: setCartItem
            })

            pushNotify({
                title: product.name,
                subTitle: "L'article a été mis a jour avec succès",
                icon: "CART",
                duration: 5
            })
        }

        if(quantity !== product.quantity) updateItemToCart()

    }, [quantity]);

    const removeItemToCart = () => {
        setCartState({
            action: CART_REMOVE_ITEM,
            product: product,
            cartItem: cartItem,
            setCartItem: setCartItem
        })

        pushNotify({
            title: product.name,
            subTitle: "L'article a été retiré avec succès",
            icon: "CART",
            duration: 5
        })
    }

    return (
        <div className='w-full'>

            <div className='bg-[#fff] max-w-[800px] mx-auto mt-4 py-2 px-6 flex gap-6 items-center justify-between rounded-lg shadow-lg'>

                <div className='flex items-start justify-start space-x-5'>
                    <Link href={`/product/${product.slug}`}>
                        <div className='h-[100px] rounded-lg aspect-square object-cover relative overflow-hidden'>
                            <BlurImage
                                src={product.main_image}
                            />
                        </div>
                    </Link>

                    <div>
                        <Link href={`/product/${product.slug}`}>
                            <div className='text-2xl font-bold'>{product.name}</div>
                        </Link>

                        <div className='flex flex-col items-start justify-between xs:hidden'>
                            <div className='text-2xl font-bold'>{(product.price * product.quantity).toFixed(2)}€</div>
                            <div className='mt-1 space-x-1'>
                                <span className='font-semibold text-md'>{(product.price).toFixed(2)}€</span>
                                <span className='text-md'>/</span>
                                <span className='text-md'>{product.price_in}</span>
                            </div>
                        </div>

                        <div className='flex mt-5 space-x-2'>
                            <div>
                                <InputNumber
                                    min={1}
                                    max={product.count_in_stock}
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
                    <div className='text-2xl font-bold'>{(product.price * product.quantity).toFixed(2)}€</div>
                    <div className='mt-1 space-x-1'>
                        <span className='font-semibold text-md'>{(product.price).toFixed(2)}€</span>
                        <span className='text-md'>/</span>
                        <span className='text-md'>{product.price_in}</span>
                    </div>
                </div>

            </div>

        </div>
    )
}