import React, { useState, useMemo, useEffect } from 'react';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder } from '@libs/typings';

import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import LineChart from '@components/ui-ux/charts/LineChart';
import TableOrderLIne from '@components/tables/TableOrderLIne';
import { useRouter } from 'next/router';
import AdminControlPannel from '@components/AdminContents/AdminControlPannel';
import Pagination from '@components/ui-ux/Pagination';
import axios from 'axios';
import ListClassement from '@components/ui-ux/ListClassement';

interface Props {
    initialOrders: TypeOrder[];
    totalResults: number;
    page: number;
    pageSize: number;
}

interface PageHandler {
    page?: number
    pageSize?: number
}

const PAGE_SIZE = 20;

function AdminOrdersScreen({ initialOrders, totalResults, page, pageSize }: Props) {

    const router = useRouter()
    const [orders, setOrders] = useState(initialOrders);
    const [checkAll, setcheckAll] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [bestSeller, setBestSeller] = useState([]);

    const maxPages = useMemo(() => Math.ceil(totalResults / pageSize), [totalResults, pageSize]);

    const pageHandler = ({ page, pageSize }: PageHandler) => {
        const { query }: any = router;
        if (page) query.page = page;
        if (pageSize) query.pageSize = pageSize;

        router.push({
            pathname: router.pathname,
            query: query,
        });
    }

    const changePage = (page: number) => pageHandler({ page });

    useEffect(() => setOrders(initialOrders), [initialOrders]);

    useEffect(() => {

        function formatDate(input) {
            const monthNames = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
        
            const [datePart, timePart] = input.split(':');
            const [year, month, day] = datePart.split('-').map(Number);
        
            // Créer un objet Date en utilisant le constructeur avec les arguments année, mois et jour
            // Notez que les mois sont indexés à partir de zéro, donc nous soustrayons 1 du mois
            const date = new Date(Date.UTC(year, month - 1, day));
        
            const formattedMonth = monthNames[date.getUTCMonth()];
            const formattedDay = date.getUTCDate();
        
            return `${formattedMonth} ${formattedDay}`;
        }

        function convertDataForChart(data) {
            const labels = [];
            const totalPrice = [];
            const numberOfOrders = [];

            data.sort((a, b) => a._id.localeCompare(b._id)); // Trier les données par date et heure

            for (const item of data) {
                const xdate = formatDate(item._id)
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
        
        function getLastSevenDaysDateUTC() {
            const date = new Date();
            date.setUTCDate(date.getUTCDate() - 7);
            date.setUTCHours(0, 0, 0, 0); // Réinitialiser les heures, minutes, secondes et millisecondes UTC à zéro
            return date;
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

            <div className='mt-5 md:flex md:space-x-5'>
                <LineChart title="Historique des commandes en €" labels={chartData ? chartData.labels : []} datasets={chartData ? chartData.totalPrice : []} />
                <LineChart title="Historique des commandes en volume" labels={chartData  ? chartData.labels : []} datasets={chartData ? chartData.numberOfOrders : []} ordonnee="" />
                <ListClassement title="Produit les plus vendu" datasets={bestSeller}/>
            </div>

            <AdminControlPannel
                pageHandler={pageHandler}

                navigationPanel={{
                    page,
                    maxPages,
                    totalResults
                }}

                rightPanel={{
                    itemsByPage: {
                        onChange: (e) => pageHandler({ pageSize: e.currentTarget.value }),
                        data: [5, 10, 20, 30, 40, 50, 75, 100],
                        currentValue: pageSize
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
    }
}

export const getServerSideProps = async ({ query }: QuerySearch) => {

    const pageSize = query.pageSize ? query.pageSize : PAGE_SIZE || 20;
    const page = query.page! && query.page >= 1 ? query.page : 1;

    try {
        await db.connect();
        const orderSearchFullQuery = {};

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
        await db.disconnect();

        return {
            props: {
                initialOrders: JSON.parse(JSON.stringify(orders)),
                totalResults: totalResults,
                page: page,
                pageSize: pageSize
            },
        }
    } catch (error) {
        await db.disconnect();
        return {
            props: {
                initialOrders: [],
                totalResults: 0,
                page: 1,
                pageSize: pageSize
            },
        }
    }
}

AdminOrdersScreen.auth = { adminOnly: true };
export default AdminOrdersScreen
