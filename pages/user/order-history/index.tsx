import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder } from '@libs/typings';
import { fixedPriceToCurrency, replaceURL, splitString } from '@libs/utils';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import BlurImage from '@components/ui-ux/BlurImage';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { useEscapeListener } from '@libs/hooks';
import { fetchPostJSON } from '@libs/utils/api-helpers';


interface ItemOrderProps {
    order: TypeOrder
}

const OrderCard = ({ order }: ItemOrderProps) => {

    const seeMenuRef = useRef(null);
    const [seeMenu, setSeeMenu] = useState(false);

    useEscapeListener(seeMenuRef, () => setSeeMenu(false))

    async function handleRefund(order: TypeOrder){
        console.log(order)
        if(!order?.stripeDetails?.id) {
            return;
        }
        const response = await fetchPostJSON("/api/checkout_sessions/refund", { sessionId: order.stripeDetails.id });
        
        if (response.ok) {
            const refund = await response.json();
            console.log('Remboursement réussi', refund);
        } else {
            const error = await response.json();
            console.error('Erreur lors du remboursement', error);
        }
    }

    return (
        <div className="py-4 mt-3 bg-white border rounded shadow-md">
            <div className="flex items-center justify-between p-4">
                <div>
                    <h2 className="text-sm font-semibold">N° DE COMMANDE: {splitString(order._id)}</h2>
                    <p className='text-sm text-gray-500'>
                        {
                            order.isCancel
                                ? "Cancel"
                                : order.isRefund
                                    ? "Commande rembourser"
                                    : order.isDelivered
                                        ? `Livré : ${new Date(order.deliveredAt!).toLocaleDateString()}`
                                        : order.isSended
                                            ? "Commande envoyée"
                                            : order.isPaid
                                                ? "En cours de Préparation"
                                                : <span className='text-red-600'>Payement en attente</span>
                        }
                    </p>
                </div>
                <div className='mx-4'>
                    <h2 className="text-sm font-semibold">Total</h2>
                    <p className='text-sm text-gray-500'>{fixedPriceToCurrency(order.totalPrice)}</p>
                </div>
                <div className='flex items-center justify-center ml-auto space-x-5'>
                    <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className='relative'>
                        <div className={`absolute left-0 z-10 mt-8 -ml-36 md:-ml-24 w-52 shadow-md dropdown-content ${!seeMenu && 'hidden'}`}>
                            <ul className="py-1 bg-white rounded shadow ">
                                <Link href={`/user/order-history/${order._id}`}>
                                    <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Voire</li>
                                </Link>

                                <li onClick={() => handleRefund(order)} className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Annuler la commande</li>

                                <Link href={`/admin/products/edit?slug=${order._id}`}>
                                    <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Facture</li>
                                </Link>
                            </ul>
                        </div>

                        <button
                            ref={seeMenuRef}
                            onClick={() => setSeeMenu(prev => !prev)}
                            className='flex items-center justify-center w-8 transition-opacity duration-300 rounded-md shadow-none hover:bg-gray-100 aspect-square button-click-effect'
                        >
                            <DotsVerticalIcon className='w-5' />
                        </button>
                    </div>
                </div>
            </div>
            <div className='px-4 border-t '>
                {order.orderItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-start mt-2">
                        <div className="relative flex-grow w-full max-w-[74px] text-gray-600">
                            <div className='relative object-cover overflow-hidden rounded-lg aspect-square'>
                                <BlurImage
                                    src={replaceURL(item.image)}
                                />
                            </div>
                        </div>
                        <div className="ml-2">
                            <Link href={`/product/${item.slug}`}>
                                <p className='text-lg font-semibold'>{item.name}</p>
                            </Link>
                            <p className='ml-2'>Quantité: {item.quantity}</p>
                            <p className='mt-1 ml-2'>Prix: {fixedPriceToCurrency(item.price)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
interface Props {
    orders: TypeOrder[]
}

const OrderHistory: NextPage<Props> = ({ orders }) => {

    return (
        <BasescreenWrapper title="Mes commandes" footer={true}>

            <div className='flex flex-col w-full max-w-3xl py-5'>
                <h1 className='text-2xl font-bold'>Mes commandes</h1>
                {
                    orders.map((order, key) => <OrderCard key={key} order={order} />)
                }
            </div>

        </BasescreenWrapper >
    );
}

export const getServerSideProps = async (context: any) => {

    const defaultReturn = {
        props: {
            orders: []
        },
    }

    try {
        const { user } = await getSession(context);
        if (!user) return defaultReturn

        await db.connect();
        const orders = await Order.find({ user: user._id }, { paymentResultStripe: 0 }).sort({ _id: -1 }).limit(10).lean();
        await db.disconnect();

        return {
            props: {
                orders: JSON.parse(JSON.stringify(orders)) || []
            },
        }
    } catch (err) {
        await db.disconnect();
        return defaultReturn
    }
}

OrderHistory.auth = true;
export default OrderHistory