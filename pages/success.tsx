import Link from 'next/link'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import useSWR from 'swr';

import { useRecoilState } from 'recoil';
import { cartState } from '@atoms/cartState';
import { CART_EMPTY, setCartState } from '@atoms/setStates/setCartState';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import PrintObject from '@components/PrintObject';
import { fetchGetJSON } from '@libs/utils/api-helpers';

const Success: NextPage = () => {
    const router = useRouter();
    const [cartItems, setCartItem] = useRecoilState(cartState)

    const { data, error } = useSWR(
        router.query.session_id
            ? `/api/checkout_sessions/${router.query.session_id}`
            : null,
        fetchGetJSON
    );

    useEffect(() => {
        if(data?.payment_intent?.status && data?.payment_intent?.status !== "requires_payment_method") {
            setCartState({
                action: CART_EMPTY,
                product: {},
                cartItems: cartItems,
                setCartItem: setCartItem
            })
        }
    }, [data]);

    return (
        <BasescreenWrapper title="Panier" footer={false}>

            <div className='grid h-screen place-items-center'>

                <div className='text-center'>

                    <h1>Checkout Payment Result</h1>
                    <h2>Status: {data?.payment_intent?.status ?? 'loading...'}</h2>
                    <h3>CheckoutSession response:</h3>
                    <PrintObject title="Print" content={data ?? 'loading...'} />


                    <Link href="/">
                        <p className='px-12 py-4 mt-4 text-white bg-red-600 cursor-pointer hover:bg-red-800'>Continue Shopping</p>
                    </Link>

                </div>

            </div>
        </BasescreenWrapper>
    )
}

export default Success