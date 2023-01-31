import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { cartState } from '@atoms/cartState';
import { CART_EMPTY, setCartState } from '@atoms/setStates/setCartState';

import { fetchPostJSON } from "@libs/utils/api-helpers";
import getStripe from "@libs/utils/get-stripejs";


import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import CartItemCard from '@components/cards/CartItemCard';

const Cart = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [cartItem, setCartItem] = useRecoilState(cartState)

    const shipping = 9.99;

    // sub total du panier
    const totalPrice = useMemo(() => {
        let total = 0
        cartItem.forEach(item => total += (item.price * item.quantity))
        return total
    }, [cartItem]);

    // passer au payment
    /*const createCheckoutSession = async () => {
        try {
            const res = axios.post('api/checkout_sessions', { cartItem })
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
        } catch (err) {
            console.log(err)
        }
        
        const stripe = await getStripe()
    } */

    const createCheckoutSession = async () => {
        setLoading(true);

        const checkoutSession = await fetchPostJSON(
            "/api/checkout_sessions",
            {
                items: cartItem,
            }
        );

        // Internal Server Error
        if ((checkoutSession).statusCode === 500) {
            console.error((checkoutSession).message);
            return;
        }

        // Redirect to checkout
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as parameter here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId: checkoutSession.id,
        });

        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        console.log(error.message);

        setLoading(false);

        if (!error) {
            setCartState({
                action: CART_EMPTY,
                product: {},
                cartItem: cartItem,
                setCartItem: setCartItem
            })
        }
    };

    return (
        <BasescreenWrapper title="Panier" footer={true}>
            <div className='container max-w-[1280px] mx-auto h-full min-h-[calc(100vh-64px)] flex'>
                <div className='flex-row block w-full min-h-full px-3 md:mx-auto md:flex'>

                    { /* panier list items */}
                    <div className='md:flex-grow w-full md:h-full md:min-w-[70%] overflow-x-hidden'>
                        <div className='w-full'>
                            {
                                cartItem.length <= 0
                                    ? <h1 className='mt-32 text-4xl text-center'>Votre panier est vide</h1>
                                    : cartItem.map((item, key) => <CartItemCard key={key} product={item} />)
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
                                className='px-8 py-4 mt-5 text-white uppercase bg-black button-click-effect'
                                onClick={createCheckoutSession}
                            >{ loading ? "Chargement..." : "Paiement" }</button>
                        </div>

                    </div>

                </div>
            </div>


        </BasescreenWrapper>
    )
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });