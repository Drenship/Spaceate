import React, { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { DotsVerticalIcon } from '@heroicons/react/solid';

import { TypeOrder } from '@libs/typings';
import { fixedPriceToCurrency, replaceURL, splitString } from '@libs/utils';
import { fetchPostJSON } from '@libs/utils/api-helpers';
import { useEscapeListener } from '@libs/hooks';

import BlurImage from '@components/ui-ux/BlurImage';
import OrderStatus from '@components/contents/orderStatus';



interface refundOrder {
    order: TypeOrder,
    message?: string,
}


type ItemOrderProps = {
    order: TypeOrder,
    setOrders: React.Dispatch<React.SetStateAction<TypeOrder[]>>
}

const UserOrderCard = ({ order, setOrders }: ItemOrderProps) => {

    const seeMenuRef = useRef(null);
    const [seeMenu, setSeeMenu] = useState(false);

    useEscapeListener(seeMenuRef, () => setSeeMenu(false))

    async function handleRefund(orderForUpdate: TypeOrder) {
        const { order: updateOrder, message }: refundOrder = await fetchPostJSON("/api/checkout_sessions/refund", {
            sessionId: orderForUpdate?.stripeDetails?.session_id ? orderForUpdate.stripeDetails.session_id : null,
            orderId: orderForUpdate._id
        });

        if (updateOrder) {
            setOrders(prev => [...prev].map(o => o._id === updateOrder._id ? updateOrder : o))
        }
    }

    const enableToRefund = useMemo(() => {
        
        if(order.isPaid === false) return false;
        
        let deliveredSatusAllow = false;
        if (order?.deliveredAt) {
            const today = new Date();
            const diffTime = today.getTime() - new Date(order?.deliveredAt).getTime();
            const diffDays = diffTime / (1000 * 3600 * 24);
            deliveredSatusAllow = diffDays > 7
        }

        return order.isCancel || order.isRefund || deliveredSatusAllow ? false : true
    }, [order]);

    return (
        <div className="py-4 mt-3 bg-white border rounded shadow-md">
            <div className="flex items-center justify-between p-4">
                <div>
                    <h2 className="text-sm font-semibold">N° DE COMMANDE: {splitString(order._id)}</h2>
                    <OrderStatus order={order} />
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

                                {
                                    enableToRefund && <li onClick={() => handleRefund(order)} className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Annuler la commande</li>
                                }

                                <li className="px-3 py-3 text-sm font-normal leading-3 tracking-normal text-gray-600 cursor-pointer hover:bg-indigo-700 hover:text-white">Facture</li>

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
                    <div key={index} className="flex items-start py-2 mt-2 border-t first:border-none">
                        <div className="relative flex-grow w-full max-w-[74px] text-gray-600">
                            <div className='relative object-cover overflow-hidden rounded-lg aspect-square'>
                                <BlurImage
                                    src={replaceURL(item.image)}
                                />
                            </div>
                        </div>
                        <div className="w-full ml-2">
                            <Link href={`/product/${item.slug}`}>
                                <p className='text-lg font-semibold'>{item.name}</p>
                            </Link>
                            <div className="flex flex-col w-full">
                                <div className='flex items-center justify-between'>
                                    <p className='text-sm font-semibold'>Prix de l'article</p>
                                    <p className="text-base leading-4 xl:text-lg">{fixedPriceToCurrency(item.price)}</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p className='text-sm font-semibold'>Quantité</p>
                                    <p className="text-base leading-4 text-gray-800 xl:text-lg">{item.quantity <= 9 ? `0${item.quantity}` : item.quantity}</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p className='text-sm font-semibold'>Sous-total</p>
                                    <p className="text-base leading-4 text-gray-800 xl:text-lg">{fixedPriceToCurrency(item.quantity * item.price)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserOrderCard;