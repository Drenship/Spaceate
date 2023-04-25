import React, { useState, useMemo, useEffect } from 'react';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder } from '@libs/typings';

import AdminscreenWrapper from '@components/Layouts/AdminscreenLayout'
import LineChart from '@components/charts/LineChart';
import TableOrderLIne from '@components/TableLines/TableOrderLIne';
import { useRouter } from 'next/router';
import AdminControlPannel from '@components/AdminContents/AdminControlPannel';
import Pagination from '@components/contents/Pagination';
import axios from 'axios';
import ListClassement from '@components/Stats/ListClassement';
import { formatChartDate, getLastSevenDaysDateUTC } from '@libs/utils/chart';

interface Props {
    initialOrders: TypeOrder[];
    totalResults: number;
    page: number;
    pageSize: number;
    order_wait_sending_id: string | null
}

interface PageHandler {
    page?: number
    pageSize?: number
    filter?: string
}

const PAGE_SIZE = 20;

function AdminOrdersScreen({ initialOrders, totalResults, page, pageSize, order_wait_sending_id }: Props) {

    const router = useRouter()
    const [orders, setOrders] = useState(initialOrders);
    const [checkAll, setcheckAll] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [bestSeller, setBestSeller] = useState([]);
    const { query }: any = router;


    const maxPages = useMemo(() => Math.ceil(totalResults / pageSize), [totalResults, pageSize]);

    const pageHandler = ({ page, pageSize, filter }: PageHandler) => {
        const { query }: any = router;
        if (page) query.page = page;
        if (pageSize) query.pageSize = pageSize;
        if (filter) {

            query.filter = filter;
            if (query.filterWithNot) delete query.filterWithNot;
            if (filter === "isPaid") query.filterWithNot = ["isCancel", "isRefund"]
            if (filter === "all") delete query.filter
            if (filter === "inAwait") {
                query.filter = "all"
                query.filterWithNot = ["isCancel", "isRefund", "isPaid"]
            }
        }

        router.push({
            pathname: router.pathname,
            query: query,
        });
    }

    const changePage = (page: number) => pageHandler({ page });

    useEffect(() => setOrders(initialOrders), [initialOrders]);

    useEffect(() => {

        function convertDataForChart(data) {
            const labels = [];
            const totalPrice = [];
            const numberOfOrders = [];

            data.sort((a, b) => a._id.localeCompare(b._id)); // Trier les données par date et heure

            for (const item of data) {
                const xdate = formatChartDate(item._id)
                if (!labels.includes(xdate)) {
                    labels.push(xdate);
                } else {
                    labels.push('');
                }
                totalPrice.push(item.totalPrice);
                numberOfOrders.push(item.numberOfOrders)
            }

            return {
                labels: labels,
                totalPrice: totalPrice,
                numberOfOrders: numberOfOrders
            };
        }

        function fillMissingData(data, intervalHours, startDate, endDate) {
            const filledData = [];

            let currentDate = new Date(startDate.getTime());
            while (currentDate <= endDate) {
                const formattedDate = currentDate.toISOString().slice(0, 13).replace('T', ':');

                const existingData = data.find(item => item._id === formattedDate);

                if (existingData) {
                    filledData.push(existingData);
                } else {
                    filledData.push({
                        _id: formattedDate,
                        totalPrice: NaN,
                        numberOfOrders: NaN
                    });
                }

                currentDate.setUTCHours(currentDate.getUTCHours() + intervalHours);
            }

            return filledData;
        }

        const fetchData = async () => {

            const { data } = await axios.get(`/api/admin/orders/stats`);

            setBestSeller(data.produitMostSelled)

            const startDate = getLastSevenDaysDateUTC();
            const endDate = new Date();
            endDate.setUTCHours(23, 0, 0, 0); // Fixer les heures à 23:00:00.000 pour couvrir la dernière journée
            const intervalHours = 12;

            const filledData = fillMissingData(data.salesData, intervalHours, startDate, endDate);
            const chartData = convertDataForChart(filledData);

            setChartData(chartData)
        };

        fetchData();
    }, []);


    return (
        <AdminscreenWrapper title="Orders">
            <h1 className='text-xl font-bold uppercase'>Orders</h1>

            <div className='mt-5 space-y-5 md:space-y-0 md:flex md:space-x-5 max-w-screen'>
                <LineChart title="Historique des commandes en €" labels={chartData ? chartData.labels : []} datasets={chartData ? chartData.totalPrice : []} />
                <LineChart title="Historique des commandes en volume" labels={chartData ? chartData.labels : []} datasets={chartData ? chartData.numberOfOrders : []} ordonnee="" />
                <ListClassement title="Produit les plus vendu" datasets={bestSeller} />
            </div>

            <AdminControlPannel
                pageHandler={pageHandler}

                navigationPanel={{
                    page,
                    maxPages,
                    totalResults
                }}

                leftPanel={{
                    custom: order_wait_sending_id && <button
                        className='px-3 py-2 text-white bg-yellow-600 rounded-md button-click-effect'
                        onClick={() => router.push(`/admin/orders/${order_wait_sending_id}`)}
                    >Préparation des commandes</button>
                }}

                rightPanel={{
                    itemsByPage: {
                        onChange: (e) => pageHandler({ pageSize: e.currentTarget.value }),
                        data: [5, 10, 20, 30, 40, 50, 75, 100],
                        currentValue: pageSize
                    },
                    filter: {
                        onChange: (e) => pageHandler({ filter: e.currentTarget.value }),
                        labels: ["Afficher tous", "En attentes", "Payer", "Annuler", "Rembourser", "Envoyer", "Livré"],
                        data: ["all", "inAwait", "isPaid", "isCancel", "isRefund", "isSended", "isDelivered"],
                        currentValue: query && query.filter ? query.filter : "all"
                    }
                }}
            />

            <div className="w-full h-full overflow-x-scroll xl:overflow-x-hidden">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full h-16 py-8 border-b border-gray-300 ">
                            <th className="pl-8 pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600">
                                <input
                                    type="checkbox"
                                    className="relative w-5 h-5 bg-white border border-gray-400 rounded outline-none cursor-pointer"
                                    onClick={() => setcheckAll(prev => !prev)}
                                />
                            </th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Commande N°</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Produits</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Status</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Payement</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Total</th>
                            <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Date</th>
                            <td className="pr-8 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">More</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order: TypeOrder, key: any) => <TableOrderLIne key={key} order={order} checkAll={checkAll} />)
                        }
                    </tbody>
                </table>
                <Pagination current={page} pages={maxPages} pageHandler={(x) => changePage(x)} />
            </div>

        </AdminscreenWrapper>
    );
}

type QuerySearch = {
    query: {
        page?: number
        pageSize?: number
        filter?: string
        filterWithNot?: string[]
    }
}

export const getServerSideProps = async ({ query }: QuerySearch) => {

    const pageSize = query.pageSize ? query.pageSize : PAGE_SIZE || 20;
    const page = query.page! && query.page >= 1 ? query.page : 1;
    const filter = query.filter! ? query.filter : "all";
    const filterWithNot = query.filterWithNot! ? query.filterWithNot : "all";

    try {

        const queryFilterWithNot: any = {};
        if (filterWithNot && filterWithNot !== "all") filterWithNot.forEach(key => { queryFilterWithNot[key] = false; })

        const queryFilter = filter && filter !== 'all'
            ? {
                [filter]: true,
                ...queryFilterWithNot
            }
            : {
                ...queryFilterWithNot
            };

        await db.connect();
        const orderSearchFullQuery = {
            ...queryFilter
        };

        const orders = await Order.find(orderSearchFullQuery, {
            _id: 1,

            orderItems: 1,
            totalPrice: 1,

            isCancel: 1,
            isRefund: 1,
            isDelivered: 1,
            isSended: 1,
            isPaid: 1,

            deliveredAt: 1,
            createdAt: 1
        })
            .sort({ createdAt: -1 })
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .lean();

        const totalResults = await Order.countDocuments(orderSearchFullQuery);

        const order_wait_sending_id = await Order.findOne(
            {
                isPaid: true,
                isSended: false,
                isRefund: false,
                isRefundAsked: false,
                isCancel: false,
                isDelivered: false,
            },
            { _id: 1 } // objet de projection
        );

        await db.disconnect();

        return {
            props: {
                initialOrders: JSON.parse(JSON.stringify(orders)),
                totalResults: totalResults,
                page: page,
                pageSize: pageSize,
                order_wait_sending_id: JSON.parse(JSON.stringify(order_wait_sending_id))._id,
            },
        }
    } catch (error) {
        await db.disconnect();
        return {
            props: {
                initialOrders: [],
                totalResults: 0,
                page: 1,
                pageSize: pageSize,
                order_wait_sending_id: null
            },
        }
    }
}

AdminOrdersScreen.auth = { adminOnly: true };
export default AdminOrdersScreen
