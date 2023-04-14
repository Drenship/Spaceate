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
        if (data?.payment_intent?.status && data?.payment_intent?.status !== "requires_payment_method") {
            useUser.clearCart();
        }
    }, [data]);

    return (
        <BasescreenWrapper title="Panier" footer={false}>
            <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-64px)] bg-gray-100">
                <div className="w-full p-8 bg-white rounded-lg shadow-md sm:w-96">
                    <h2 className="mb-6 text-2xl font-bold text-center">404 - Page introuvable</h2>
                    <p className="mb-4 text-center text-gray-700">
                        Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="/"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Retour à l'accueil
                        </a>
                    </div>
                </div>
            </div>
        </BasescreenWrapper>
    )
}

export default Success