import React, { useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder } from '@libs/typings';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';

interface Props {
    query_id: string,
    order: TypeOrder,
    countOrders: number,
    orderNotFound: boolean,
    err?: any
}

const OrderSummary: NextPage<Props> = ({ query_id, order, countOrders, orderNotFound, err }) => {
    console.log(query_id, order, countOrders, orderNotFound, err)
    return (
        <BasescreenWrapper>
            <div>
                {query_id}
            </div>
        </BasescreenWrapper>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

    const defaultReturn = (txt: string, err?: object | undefined) => ({
        props: {
            query_id: txt,
            order: {},
            countOrders: 0,
            orderNotFound: true,
            err: err
        },
    })

    try {
        const { query: { id } } = context;
        if (!id) return defaultReturn("id not found")

        const { user } = await getSession(context);
        if (!user) return defaultReturn("user not found")


        await db.connect();
        const order = await Order.findOne({ _id: id, user: user._id }, { paymentResultStripe: 0 }).populate('user').lean();
        const countOrders = await Order.countDocuments({ _id: id, user: user._id });
        await db.disconnect();

        return {
            props: {
                query_id: id,
                order: JSON.parse(JSON.stringify(order)),
                countOrders: countOrders,
                orderNotFound: order && order._id ? false : true
            },
        }

    } catch (err) {
        await db.disconnect();
        return {
            props: {
                query_id: "err catch",
                order: {},
                countOrders: 0,
                orderNotFound: true,
                err: err
            },
        }
    }
}

OrderSummary.auth = true;
export default OrderSummary;