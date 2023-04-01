import OrderStatus from '@components/contents/orderStatus';
import { TypeOrder } from '@libs/typings';
import { UTCStringToDate, fixedPriceToCurrency, replaceURL } from '@libs/utils';
import Link from 'next/link';
import React from 'react';


interface TableProfilOrderLineProps {
    order: TypeOrder
}

export default function TableProfilOrderLine({ order }: TableProfilOrderLineProps) {

    return (
        <tr className='w-full [&:nth-child(1)]:border-t [&:not(:last-child)]:border-b hover:bg-gray-50 px-1'>
            <td>
                <Link href={`/user/order-history/${order._id}`} className='-space-x-6 avatar-group'>

                    {
                        order.orderItems.length > 0 && [...order.orderItems].slice(0, 4).map((p, k) => <div key={k} className="avatar">
                            <div className="w-12">
                                <img src={replaceURL(p.image)} alt={`panier spaceate - ${p.name}`} />
                            </div>
                        </div>)
                    }

                    {
                        order.orderItems.length > 4 && (
                            <div className="select-none avatar placeholder">
                                <div className="w-12 bg-neutral-focus text-neutral-content">
                                    <span>+{order.orderItems.length - 3}</span>
                                </div>
                            </div>

                        )
                    }
                </Link>
            </td>
            <td className="px-3 whitespace-no-wrap">
                <Link href={`/user/order-history/${order._id}`}>
                    <OrderStatus order={order} />
                </Link>
            </td>
            <td className="px-3 text-sm leading-4 tracking-normal text-right text-gray-800 whitespace-no-wrap">{fixedPriceToCurrency(order.totalPrice)}</td>
            <td className="pl-3 text-sm leading-4 tracking-normal text-right text-gray-800 whitespace-no-wrap">{UTCStringToDate(order.createdAt)}</td>
        </tr>
    )

} 