import React, { useEffect, useState, useMemo } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeUser, TypeOrder } from '@libs/typings';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import Pagination from '@components/ui-ux/Pagination';
import UserOrderCard from '@components/cards/UserOrderCard';

// default params
const PAGE_SIZE = 20;
const DEFAULT_TIMEFRAME = "30days";

interface RouterQueryParams {
    timeframe?: string;
    page?: number;
}

interface Props {
    initialOrders: TypeOrder[],
    countOrder: number,
    pages: number,
}

const OrderHistory: NextPage<Props> = ({ initialOrders, countOrder, pages }) => {
    const router = useRouter()
    const [orders, setOrders] = useState(initialOrders)

    const { data: session } = useSession();
    const user: TypeUser | null = session?.user ?? null;

    const {
        timeframe = DEFAULT_TIMEFRAME,
        page = 1,
    }: RouterQueryParams = router.query;

    const ordersOptionsTimeframe = useMemo(() => {
        if (!user) return [];
        const createdAt = new Date(user?.createdAt);
        let options = [];

        // Les 30 derniers jours
        options.push({ value: "30days", label: 'Dans les 30 derniers jours' });
        options.push({ value: '3months', label: 'Les 3 derniers mois' });

        // Ajouter une option pour chaque année depuis la création du compte
        const currentYear = new Date().getFullYear();
        const accountYear = createdAt.getFullYear();
        for (let year = currentYear; year >= accountYear; year--) {
            options.push({ value: year, label: `Année ${year}` });
        }

        return options || []
    }, [user])


    const pageHandler = ({ timeframe, page }: RouterQueryParams) => {
        const { query }: any = router;
        if (page) query.page = page ? page : 1;
        if (timeframe) query.timeframe = timeframe ? timeframe : null;

        router.push({
            pathname: router.pathname,
            query: query,
        });
    };

    useEffect(() => setOrders(initialOrders), [initialOrders]);

    return (
        <BasescreenWrapper title="Mes commandes" footer={true}>

            <div className='flex flex-col w-full max-w-3xl px-2 py-5 overflow-x-hidden md:overflow-x-visible md:px-0'>
                <h1 className='text-2xl font-bold'>Mes commandes</h1>

                <div className='flex items-center justify-between space-x-5 md:justify-start'>
                    <p className='font-semibold'>{countOrder} commandes passées</p>

                    <select
                        onChange={(e) => pageHandler({ timeframe: e.target.value, page: 1 })}
                        defaultValue={timeframe}
                        className="px-2 py-1 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap bg-white border rounded-md"
                    >
                        {ordersOptionsTimeframe.map((option, key) => (
                            <option
                                key={key}
                                value={option.value}
                            >{option.label}</option>
                        ))}
                    </select>
                </div>

                {
                    orders.map((order, key) => <UserOrderCard key={key} order={order} setOrders={setOrders} />)
                }
                <Pagination
                    current={page}
                    pages={pages}
                    pageHandler={(x: number) => pageHandler({ page: x })}
                />
            </div>

        </BasescreenWrapper >
    );
}

export const getServerSideProps = async (context: any) => {

    const { query } = context;

    const pageSize = PAGE_SIZE;
    const page = query.page >= 1 ? query.page : 1;
    const timeframe = query.timeframe ? query.timeframe : DEFAULT_TIMEFRAME

    const defaultReturn = {
        props: {
            initialOrders: [],
            countOrder: 0,
            pages: 1,
        },
    }

    try {
        const { user } = await getSession(context);
        user as TypeUser || null;
        if (!user) return defaultReturn



        let timeframefilter = {}
        if (timeframe) {
            let startOfMonth, endOfMonth;
            switch (timeframe) {
                case '30days':
                    const currentDate = new Date();
                    startOfMonth = currentDate.setDate(currentDate.getDate() - 30);
                    endOfMonth = new Date();
                    break;
                case '3months':
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);
                    startOfMonth = new Date(threeMonthsAgo.getFullYear(), threeMonthsAgo.getMonth(), 1);
                    endOfMonth = new Date();
                    break;
                default:
                    startOfMonth = new Date(Number(timeframe), 0, 1);
                    endOfMonth = new Date(Number(timeframe), 11, 31);
                    break;
            }
            console.log({
                startOfMonth,
                endOfMonth
            })
            timeframefilter = {
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            }
        }

        const ordersQueryFilter = {
            user: user._id,
            ...timeframefilter
        }

        await db.connect();

        const orders = await Order.find(ordersQueryFilter, { paymentResultStripe: 0 }).sort({ createdAt: -1 }).skip(pageSize * (page - 1)).limit(10).lean();
        const countOrder = await Order.countDocuments(ordersQueryFilter);

        return {
            props: {
                initialOrders: JSON.parse(JSON.stringify(orders)) || [],
                countOrder: countOrder,
                pages: Math.ceil(countOrder / pageSize),
            },
        }
    } catch (err) {
        return defaultReturn
    } finally {
        await db.disconnect();
    }
}

OrderHistory.auth = true;
export default OrderHistory