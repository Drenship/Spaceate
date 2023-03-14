import BlurImage from '@components/ui-ux/BlurImage';
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder, TypeOrderProduct } from '@libs/typings';
import { replaceURL } from '@libs/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';


interface ItemOrderProps {
    order: TypeOrder
}

const ItemOrder = ({ order }: ItemOrderProps) => (
    <div className='flex flex-col items-start w-full p-3 mb-3 border-2 border-black'>
        <Link href={`/user/order-history/${order._id}`}>
            {order._id}
        </Link>
        <div>
            status: {order.isPaid ? "paid" : "not paid"}
        </div>
        <div className='flex flex-col pt-1'>
            {
                order.orderItems.map((item: TypeOrderProduct, key) => (
                    <div key={key} className="flex">
                        <div className="relative text-gray-600 w-[74px] flex-grow">
                            <div className='relative object-cover w-full overflow-hidden rounded-lg aspect-square'>
                                <BlurImage
                                    src={replaceURL(item.image)}
                                />
                            </div>
                        </div>
                        <h2>{item.name}</h2>
                    </div>
                ))
            }
        </div>
    </div>
)

interface Props {
    orders: TypeOrder[]
}

const OrderHistory: NextPage<Props> = ({ orders }) => {

    console.log(orders[0].orderItems)
    return (
        <BasescreenWrapper title="Mes commandes" footer={true}>

            <div className='flex flex-col w-full max-w-3xl py-5'>
                <h1 className='text-2xl font-bold'>Mes commandes</h1>
                {
                    orders.map((order, key) => <ItemOrder key={key} order={order} />)
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
        const orders = await Order.find({ user: user._id }, { paymentResultStripe: 0 }).lean();
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