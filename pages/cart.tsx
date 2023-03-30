import React, { useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next/types'
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRecoilState } from 'recoil';

import { CART_UPDATE_ITEM, setCartState } from '@atoms/setStates/setCartState';
import { cartState } from '@atoms/cartState';
import { TypeCartItem, TypeUser } from '@libs/typings'
import { fetchPostJSON } from "@libs/utils/api-helpers";
import { getStripe } from "@libs/utils/stripe-helpers";

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import CartItemCard from '@components/cards/CartItemCard';
import { useSession } from 'next-auth/react';


interface Update {
    product: TypeCartItem
    text: string
}

const Cart: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession();
    const user = session && session.user as TypeUser || null;
    const [priceChange, setPriceChange] = useState<Update[]>([])
    const [cartItems, setCartItem] = useRecoilState<TypeCartItem[]>(cartState)

    const shipping = 9.99;

    // sub total du panier
    const totalPrice = useMemo(() => {
        let total = 0
        cartItems.forEach(item => total += (item.price * item.quantity))
        return total
    }, [cartItems]);



    const createCheckoutSession = async () => {

        if(!user) return;

        setLoading(true);

        const itemsForCheckout = [...cartItems].filter(i => {
            if (i.outOfQuantity === true || i.outOfStock === true) return;
            return i;
        })

        if(itemsForCheckout.length <= 0) return;
        
        // init stripe
        const stripe = await getStripe();
        if (!stripe) {
            setLoading(false);
            return;
        }
        
        // Put order
        const createOrder = await fetchPostJSON("/api/order", { items: itemsForCheckout });
        if (!createOrder || createOrder.err) {
            setLoading(false);
            return;
        }

        const checkoutSession = await fetchPostJSON("/api/checkout_sessions", { items: itemsForCheckout, order_id: createOrder.data._id });
        // Internal Server Error
        if ((checkoutSession).statusCode === 500) {
            console.error((checkoutSession).message);
            setLoading(false);
            return;
        }

        // Redirect to checkout
        const { error } = await stripe.redirectToCheckout({ sessionId: checkoutSession.id });
        if (!stripe) alert(error.message);

        setLoading(false);
    };

    const disabledCheckoutButton = useMemo(() => loading || cartItems.length === 0 || !user, [user, cartItems, loading]);


    const checkUpdateCart = async () => {
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
            console.log(findItem.quantity, item.countInStock)

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
    }

    // PB double rendu de checkUpdateCart
    useEffect(() => { checkUpdateCart() }, []);

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

                            <button
                                role="link"
                                className='px-8 py-4 mt-5 text-white uppercase bg-black button-click-effect disabled:bg-gray-600 disabled:text-gray-300 disabled:hover:active:scale-100'
                                onClick={createCheckoutSession}
                                disabled={disabledCheckoutButton}
                            >{loading ? "Chargement..." : "Paiement"}</button>
                        </div>

                    </div>

                </div>
            </div>
        </BasescreenWrapper>
    )
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });