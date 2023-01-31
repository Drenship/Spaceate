import React, { useMemo } from 'react'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from "axios";
import { useRecoilState } from 'recoil';
import { cartState } from '@atoms/cartState.ts';
import { CART_EMPTY, setCartState } from '@atoms/setStates/setCartState';
import getStripe from "@libs/utils/get-stripejs.ts";
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import CartItemCard from '@components/cards/CartItemCard';

const Cart = () => {
    const router = useRouter()
    const [cartItem, setCartItem] = useRecoilState(cartState)

    const shipping = 9.99;

    // sub total du panier
    const totalPrice = useMemo(() => {
        let total = 0
        cartItem.forEach(item => total += (item.price * item.quantity))
        return total
    }, [cartItem]);
    
    // passer au payment
    const createCheckoutSession = async () => {
        axios.post('api/checkout_sessions', { cartItem })
            .then(res => {
                console.log(res)
                // clear cart 
                setCartState({
                    action: CART_EMPTY,
                    product: {},
                    cartItem: cartItem,
                    setCartItem: setCartItem
                })
                // redirect
                router.push(res.data.sessionURL)
            })
            .catch(err => console.log(err))

            getStripe()
    }

    return (
        <BasescreenWrapper title="Panier">
            <div className='container max-w-[1280px] mx-auto h-full min-h-[calc(100vh-64px)] flex'>
                <div className='flex-row block w-full min-h-full px-3 md:mx-auto md:flex'>

                    { /* panier list items */}
                    <div className='md:flex-grow w-full md:h-full md:min-w-[70%] overflow-x-hidden'>
                        <div className='w-full'>
                            {
                                cartItem.length <= 0
                                    ? <h1 className='mt-32 text-4xl text-center'>Votre panier est vide</h1>
                                    : cartItem.map(item => <CartItemCard key={item.id} product={item} />)
                            }
                        </div>
                    </div>

                    { /* menu total details */}
                    <div className='bg-gray-100 md:h-full md:flex-shrink-1 md:w-full'>

                        <div className='max-w-[800px] mx-auto mt-4 flex flex-col p-5 h-full'>

                            <p class="lg:text-4xl text-3xl font-black leading-9">Panier</p>

                            <div class="flex items-center justify-between pt-16">
                                <p class="text-base leading-none">Total des articles</p>
                                <p class="text-base leading-none">{(totalPrice).toFixed(2)}€</p>
                            </div>

                            <div class="flex items-center justify-between pt-4">
                                <p class="text-base leading-none">Frais de livraison</p>
                                <p class="text-base leading-none">{(shipping).toFixed(2)}€</p>
                            </div>



                            <div class="flex items-center justify-between lg:pt-5 pt-20">
                                <p class="text-2xl leading-normal">Total</p>
                                <p class="text-2xl font-bold leading-normal text-right">{(totalPrice + shipping).toFixed(2)}€</p>
                            </div>

                            <button
                                className='px-8 py-4 mt-5 text-white uppercase bg-black button-click-effect'
                                onClick={createCheckoutSession}
                            >Paiement</button>
                        </div>

                    </div>

                </div>
            </div>


        </BasescreenWrapper>
    )
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });