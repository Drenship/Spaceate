import Link from 'next/link'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import useSWR from 'swr';

import BasescreenWrapper from '@components/Layouts/BasescreenLayout';
import { fetchGetJSON } from '@libs/utils/api-helpers';
import useUserStore from '@libs/hooks/modals/useUserStore';

const Success: NextPage = () => {
    const router = useRouter();
    const useUser = useUserStore();

    const { data, error } = useSWR(
        router.query.session_id
            ? `/api/checkout_sessions/${router.query.session_id}`
            : null,
        fetchGetJSON
    );

    useEffect(() => {
        if(data?.payment_intent?.status && data?.payment_intent?.status !== "requires_payment_method") {
            useUser.clearCart();
        }
    }, [data]);

    return (
        <BasescreenWrapper title="Panier" footer={false}>

            <div className='grid h-screen place-items-center'>

                <div className='text-center'>

                    <h1>Checkout Payment Result</h1>
                    <h2>Status: {data?.payment_intent?.status ?? 'loading...'}</h2>
                    <h3>CheckoutSession response:</h3>

                    <Link href="/">
                        <p className='px-12 py-4 mt-4 text-white bg-red-600 cursor-pointer hover:bg-red-800'>Continue Shopping</p>
                    </Link>

                </div>

            </div>
        </BasescreenWrapper>
    )
}

export default Success