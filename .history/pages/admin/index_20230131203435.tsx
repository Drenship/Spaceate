import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Bar } from 'react-chartjs-2';

import { fetchGetJSON } from '@libs/utils/api-helpers';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'

type SalesData = {
    _id: string,
    totalSales: Number
}

type ChartSalesData = {
    label: string,
    backgroundColor: string,
    data: [number],
}

type Summary = {
    data: {
        ordersCount: Number,
        productsCount: Number,
        usersCount: Number,
        ordersPrice: Number,
        salesData: SalesData[],
    },
    error: any
}

function AdminDashboardScreen() {

    const { data: summary, error } : Summary = useSWR("/api/admin/summary", fetchGetJSON);

    console.log(summary)


    const chartSalesData: ChartSalesData = useMemo(() => {
        if (!summary) return {
            label: 'Sales',
            backgroundColor: 'rgba(162, 222, 208, 1)',
            data: []
        }

        return {
            labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
            datasets: [
                {
                    label: 'Sales',
                    backgroundColor: 'rgba(162, 222, 208, 1)',
                    data: summary.salesData.map((x) => x.totalSales),
                },
            ],
        }
    }, [summary]);


    return (
        <AdminscreenWrapper title="Dashboard">
            <h1>DASHBOARD</h1>

            <div>
                <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="p-5 m-5 card">
                        <p className="text-3xl">${summary.ordersPrice} </p>
                        <p>Sales</p>
                        <a href="/admin/orders">View sales</a>
                    </div>
                    <div className="p-5 m-5 card">
                        <p className="text-3xl">{summary.ordersCount} </p>
                        <p>Orders</p>
                        <a href="/admin/orders">View orders</a>
                    </div>
                    <div className="p-5 m-5 card">
                        <p className="text-3xl">{summary.productsCount} </p>
                        <p>Products</p>
                        <a href="/admin/products">View products</a>
                    </div>
                    <div className="p-5 m-5 card">
                        <p className="text-3xl">{summary.usersCount} </p>
                        <p>Users</p>
                        <a href="/admin/users">View users</a>
                    </div>
                </div>
                <h2 className="text-xl">Sales Report</h2>
                <Bar
                    options={{
                        legend: { display: true, position: 'right' },
                    }}
                    data={chartSalesData}
                />
            </div>

        </AdminscreenWrapper>
    );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen