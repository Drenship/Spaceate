import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { cartState } from "@atoms/cartState"
import { setCartState, CART_ADD_ITEM, CART_REMOVE_ITEM } from "@atoms/setStates/setCartState"
import { useNotifys } from '@libs/hooks/notify';
import InputNumber from '@components/ui-ux/inputs/InputNumber'
import BlurImage from '@components/ui-ux/BlurImage'
import { replaceURL } from '@libs/utils';

export default function CartItemCard({ product }) {

    const { pushNotify } = useNotifys();
    const [notify, setNotify] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity);
    const [cartItem, setCartItem] = useRecoilState(cartState)

    const isOutOfStock = useMemo(() => product.countInStock <= 0, [product]);

    useEffect(() => {
        const updateItemToCart = () => {
            if (isOutOfStock) {
                return alert('le produit est en rupture de stock');
            }


            let newProductCart = { ...product }
            newProductCart.quantity = quantity

            setCartState({
                action: CART_ADD_ITEM,
                product: newProductCart,
                cartItem: cartItem,
                setCartItem: setCartItem
            })
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
        setCartState({
            action: CART_REMOVE_ITEM,
            product: product,
            cartItem: cartItem,
            setCartItem: setCartItem
        })

        pushNotify({
            title: "",
            subTitle: "L'article a été retiré avec succès",
            icon: "CART",
            duration: 5
        })
    }

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