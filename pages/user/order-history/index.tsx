import BlurImage from '@components/ui-ux/BlurImage';
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { replaceURL } from '@libs/utils';
import { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';

interface Props {
    orders: any[]
}

const OrderHistory: NextPage<Props> = ({ orders }) => {

    console.log(orders[0].orderItems)
    return (
        <BasescreenWrapper title="Mes commandes" footer={true}>

            <div className='flex flex-col'>
                {
                    orders.map((order, key) => (
                        <div key={key}>
                            <div>{order._id}</div>
                            <div className='flex flex-col'>
                                {
                                    order.orderItems.map((item, key) => (
                                        <div key={key}>
                                            <div className="relative text-gray-600 max-w-[74px]">
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
                    ))
                }
            </div>

        </BasescreenWrapper >
    );
}

export const getServerSideProps = async (context) => {

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