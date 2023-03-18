import React, { useEffect, useState, useMemo } from 'react';
import type { NextPage } from 'next/types'
import Link from 'next/link';
import axios from 'axios';
import { BsBoxSeam, BsCreditCard, BsGraphUp, BsTags } from 'react-icons/bs';
import { BiTimer, BiUser } from 'react-icons/bi';

import { TypeOrder } from '@libs/typings';
import { fixedPriceToCurrency, splitString, UTCStringToDate } from '@libs/utils';
import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { formatChartDate } from '@libs/utils/chart';

import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import BarChart from '@components/ui-ux/charts/BarCHart';

type SalesData = {
    _id: string,
    totalSales: number
}

type Summary = {
    ordersCount: number,
    productsCount: number,
    usersCount: number,
    ordersPrice: number,
    salesData: SalesData[]
}

interface Props {
    orders: TypeOrder[],
}

interface StatsDashboardProps {
    title: string,
    info: string,
    link: string,
    linkLabel: string,
    children: any
}

const StatsDashboard = ({ title, info, link, linkLabel, children }: StatsDashboardProps) => (
    <div className="w-full max-w-sm p-5 mx-auto border shadow-md md:mx-0 card">
        <div className='flex items-center justify-between'>
            <p className="text-3xl">{info} </p>
            <p>{title}</p>
        </div>
        <div className='flex items-center justify-between mt-3'>
            <Link href={link} className='text-[#f26c6d]'>{linkLabel}</Link>
            <div>
                {children}
            </div>
        </div>
    </div>
)

const AdminDashboardScreen: NextPage<Props> = ({ orders }) => {
    const [loading, setloading] = useState(true);
    const [summary, setSummary] = useState<Summary>({
        salesData: [],
        ordersCount: 0,
        productsCount: 0,
        usersCount: 0,
        ordersPrice: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setloading(true)
                const { data } = await axios.get(`/api/admin/summary`);
                setSummary(data)
                setloading(false)
            } catch (err) {
                setloading(false)
            }
        };

        fetchData();
    }, []);



    const datasetsBarChart = useMemo(() => ({
        labels: summary.salesData.map((x: SalesData) => formatChartDate(x._id)), // 2022/01 2022/03
        datasets: [
            {
                backgroundColor: '#f26c6d',
                data: summary.salesData.map((x: SalesData) => x.totalSales),
            },
        ],
    }), [summary]);


    return (
        <AdminscreenWrapper title="Dashboard">
            <h1 className="text-xl font-bold uppercase">DASHBOARD</h1>

            <h2 className='w-full max-w-sm mt-5 mb-3 font-bold uppercase text-md'>Informations global</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <StatsDashboard
                    title="Totals des ventes"
                    info={fixedPriceToCurrency(summary.ordersPrice)}
                    link="/admin/orders"
                    linkLabel="Voire plus"
                >
                    <BsGraphUp className='w-8 h-8' />
                </StatsDashboard>
                <StatsDashboard
                    title="Totals des commandes"
                    info={summary.ordersCount.toString()}
                    link="/admin/orders"
                    linkLabel="Voire plus"
                >
                    <BsBoxSeam className='w-8 h-8' />
                </StatsDashboard>
                <StatsDashboard
                    title="Nombre de produits"
                    info={summary.productsCount.toString()}
                    link="/admin/products"
                    linkLabel="Voire plus"
                >
                    <BsTags className='w-8 h-8' />
                </StatsDashboard>
                <StatsDashboard
                    title="Nombre d'utilisateurs"
                    info={summary.usersCount.toString()}
                    link="/admin/users"
                    linkLabel="Voire plus"
                >
                    <BiUser className='w-8 h-8' />
                </StatsDashboard>
            </div>

            <div className='flex flex-col-reverse items-start justify-between md:flex-row'>
                {/* l */}
                <div className='w-full md:w-[70%]'>
                    <div className='max-w-full mt-5 space-y-5 md:space-y-0 md:flex md:space-x-5'>
                        <BarChart title="Report des ventes" datasets={datasetsBarChart} />
                        <BarChart title="Report des ventes" datasets={datasetsBarChart} />
                    </div>
                    <div>
                        <h2 className='w-full max-w-sm mt-5 font-bold uppercase text-md'>Dernieres commandes</h2>
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="w-full h-12 border-b border-gray-300">
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Commande N°</th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Payement</th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Total</th>
                                    <th className="pr-6 text-sm font-normal leading-4 tracking-normal text-left text-gray-600 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.map((order: TypeOrder, key: any) => <tr key={key} className="h-12 border-b border-gray-300">
                                        <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{splitString(order._id)}</td>
                                        <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">
                                            {
                                                order.isRefund
                                                    ? <span className="w-2 h-2 px-2.5 py-1 text-white bg-red-600 rounded-full">Rembourser</span>
                                                    : order.isCancel ? <span className="w-2 h-2 px-2.5 py-1 text-white bg-yellow-500 rounded-full">Annuler</span>
                                                        : order.isPaid ? <span className="w-2 h-2 px-2.5 py-1 text-white bg-green-600 rounded-full">Payer</span>
                                                            : <span className="w-2 h-2 px-2.5 py-1 text-white bg-red-600 rounded-full">Payement en attente</span>

                                            }
                                        </td>
                                        <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{fixedPriceToCurrency(order.totalPrice)}</td>
                                        <td className="pr-6 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{UTCStringToDate(order.createdAt)}</td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* r */}
                <div className='w-full md:w-[30%] md:h-full flex flex-col md:items-end md:justify-start space-y-3 mt-3'>
                    <h2 className='w-full max-w-sm font-bold uppercase text-md'>Infos du jour</h2>
                    <StatsDashboard
                        title="Payement du jour"
                        info={fixedPriceToCurrency(summary.ordersPrice)}
                        link="/admin/orders"
                        linkLabel="Voire plus"
                    >
                        <BsCreditCard className='w-8 h-8' />
                    </StatsDashboard>
                    <StatsDashboard
                        title="Payement en attentes"
                        info={fixedPriceToCurrency(summary.ordersPrice)}
                        link="/admin/orders"
                        linkLabel="Voire plus"
                    >
                        <BiTimer className='w-8 h-8' />
                    </StatsDashboard>
                    <StatsDashboard
                        title="Commandes du jour"
                        info={summary.ordersCount.toString()}
                        link="/admin/orders"
                        linkLabel="Voire plus"
                    >
                        <BsBoxSeam className='w-8 h-8' />
                    </StatsDashboard>
                    <StatsDashboard
                        title="Nouveaux utilisateurs"
                        info={summary.usersCount.toString()}
                        link="/admin/users"
                        linkLabel="Voire plus"
                    >
                        <BiUser className='w-8 h-8' />
                    </StatsDashboard>
                </div>
            </div>

        </AdminscreenWrapper>
    );
}

export const getServerSideProps = async () => {
    try {

        await db.connect();
        const orderSearchFullQuery = {};

        const orders = await Order.find(orderSearchFullQuery, {
            _id: 1,

            totalPrice: 1,

            isCancel: 1,
            isRefund: 1,
            isPaid: 1,

            deliveredAt: 1,
            createdAt: 1
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        await db.disconnect();

        return {
            props: {
                orders: JSON.parse(JSON.stringify(orders)),
            }
        }
    } catch (error) {
        await db.disconnect();
        return {
            props: {
                orders: [],
            },
        }
    }
}


AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;