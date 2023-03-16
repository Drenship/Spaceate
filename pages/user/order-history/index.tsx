import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder, TypeOrderProduct } from '@libs/typings';
import { replaceURL } from '@libs/utils';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import BlurImage from '@components/ui-ux/BlurImage';
import { DotsVerticalIcon } from '@heroicons/react/solid';


interface ItemOrderProps {
    order: TypeOrder
}

const OrderCard = ({ order }: ItemOrderProps) => (
    <div className="py-4 mt-3 bg-white border rounded shadow-md">
        <div className="flex items-center p-4 ">
            <div>
                <h2 className="font-semibold text-md">N° DE COMMANDE: {order._id}</h2>
                <p className='text-sm text-gray-500'>
                    {
                        order.isCancel
                            ? "Cancel"
                            : order.isRefund
                                ? "Commande rembourser"
                                : order.isDelivered
                                    ? "Commande livrais"
                                    : order.isSended
                                        ? "Commande envoyée"
                                        : order.isPaid
                                            ? "En cours de Préparation"
                                            : "Payement en attente"
                    }
                </p>
            </div>
            <div className='flex items-center justify-center ml-auto space-x-5'>
                <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <button className='flex items-center justify-center w-8 transition-opacity duration-300 rounded-md shadow-none hover:bg-gray-100 aspect-square button-click-effect'><DotsVerticalIcon className='w-5' /></button>
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
                        <Link href={`/user/order-history/${order._id}`}>
                            <p className='text-lg font-semibold'>{item.name}</p>
                        </Link>
                        <p>
                            {item.quantity} x ${item.price}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

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
        const orders = await Order.find({ user: user._id }, { paymentResultStripe: 0 }).sort({ _id: -1 }).lean();
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