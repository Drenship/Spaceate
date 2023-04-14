import React, { useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next/types'
import dynamic from 'next/dynamic';

import { TypeCartItem } from '@libs/typings'

import BasescreenWrapper from '@components/Layouts/BasescreenLayout';
import CartItemCard from '@components/cards/CartItemCard';
import { activePromotion, priceWithPromotion } from '@libs/utils/productUtils';
import useUserStore from '@libs/hooks/modals/useUserStore';
import useProcessOrderStore from '@libs/hooks/modals/useProcessOrderModal';
import DefaultSendButton from '@components/buttons/DefaultSendButton';


interface Update {
    product: TypeCartItem
    text: string
}

const CartScreen: NextPage = () => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => setHasMounted(true), [])

    const useProcessOrder = useProcessOrderStore();
    const useUser = useUserStore();
    const { user, cart: cartItems } = useUser;
    const [loading, setLoading] = useState(false);

    const [priceChange, setPriceChange] = useState<Update[]>([])
    const shipping = 9.99;

    const disabledCheckoutButton = useMemo(() => loading || cartItems.length === 0 || !user, [user, cartItems, loading]);

    // sub total du panier
    const totalPrice = useMemo(() => {
        let total = 0
        cartItems.forEach(item => total += (priceWithPromotion(item, activePromotion(item)) * item.quantity))
        return total
    }, [cartItems]);

    /*const checkUpdateCart = async () => {
     const ids: string[] = []
     const oldCartData = cartItems;
     cartItems.forEach(item => ids.push(item._id))
 
     if (ids.length === 0) return;
 
     const { data: { data } } = await axios.post('/api/product/checkUpdate', { ids: ids })
 
     data.forEach((item: any) => {
         setCartState({
             action: CART_UPDATE_ITEM,
             product: item,
             cartItem: cartItems,
             setCartItem: setCartItem
         })
 
         const findItem: TypeCartItem = oldCartData.filter(i => i.slug === item.slug)[0]
 
         if (findItem && findItem.price !== item.price || findItem && findItem.quantity > item.countInStock || item.countInStock <= 0) {
             setPriceChange(prev => {
                 if (prev.findIndex(e => e.product.slug === item.slug) !== -1) {
                     return [...prev]
                 };
 
                 if (item.countInStock <= 0) {
                     return [...prev, {
                         product: findItem,
                         text: `Le produit ${findItem.name} est en rupture de stock !`
                     }]
                 }
 
                 if (findItem.quantity > item.countInStock) {
                     return [...prev, {
                         product: findItem,
                         text: `La quantité demandée n'est pas disponible pour des ${findItem.name}, il en reste ${item.countInStock} en stock !`
                     }]
                 }
 
                 return [...prev, {
                     product: findItem,
                     text: `Le prix des ${findItem.name} passe de ${findItem.price}€ à ${item.price}€`
                 }]
 
             })
         }
     })
     }*/

    //useEffect(() => { hasMounted && checkUpdateCart() }, [hasMounted]);

    return (
        <BasescreenWrapper title="Panier" footer={true}>
            <div className='container max-w-[1280px] mx-auto h-full min-h-[calc(100vh-64px)] flex'>
                <div className='flex-row block w-full min-h-full md:px-3 md:mx-auto md:flex'>

                    { /* panier list items */}
                    <div className='md:flex-grow w-full md:h-full md:min-w-[70%] overflow-x-hidden'>
                        {
                            priceChange.length > 0 && (
                                <div className='w-full px-6'>
                                    <div className='w-full mx-auto mt-5 p-4 space-y-2 border border-yellow-600 rounded-lg bg-yellow-600/20 max-w-[800px] shadow-lg'>
                                        {
                                            priceChange.map((update, key) => <p key={key} className="text-red-600">{update.text}</p>)
                                        }
                                    </div>
                                </div>
                            )
                        }
                        <div className='w-full'>
                            {
                                cartItems.length <= 0
                                    ? <h1 className='mt-32 text-4xl text-center'>Votre panier est vide</h1>
                                    : cartItems.map((item, key) => <CartItemCard key={key} product={item} />)
                            }
                        </div>
                    </div>

                    { /* menu total details */}
                    <div className='bg-gray-100 md:h-full md:flex-shrink-1 md:w-full'>

                        <div className='max-w-[800px] mx-auto mt-4 flex flex-col p-5 h-full'>

                            <p className="text-3xl font-black leading-9 lg:text-4xl">Panier</p>

                            <div className="flex items-center justify-between pt-16">
                                <p className="text-base leading-none">Total des articles</p>
                                <p className="text-base leading-none">{(totalPrice).toFixed(2)}€</p>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <p className="text-base leading-none">Frais de livraison</p>
                                <p className="text-base leading-none">{(shipping).toFixed(2)}€</p>
                            </div>

                            <div className="flex items-center justify-between pt-20 lg:pt-5">
                                <p className="text-2xl leading-normal">Total</p>
                                <p className="text-2xl font-bold leading-normal text-right">{(totalPrice + shipping).toFixed(2)}€</p>
                            </div>

                            <DefaultSendButton
                                className='w-full'
                                isDisabled={disabledCheckoutButton}
                                onClick={useProcessOrder.onOpen}
                                title='Passer commande'
                            />
                        </div>

                    </div>

                </div>
            </div>
        </BasescreenWrapper>
    )
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });