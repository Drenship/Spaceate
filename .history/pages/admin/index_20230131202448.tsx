import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Bar } from 'react-chartjs-2';

import { fetchGetJSON } from '@libs/utils/api-helpers';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import PrintObject from '@components/PrintObject'; 

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

    const { data: {
        ordersCount,
        productsCount,
        usersCount,
        ordersPrice,
        salesData,
    }, error } = useSWR("/api/admin/summary", fetchGetJSON);

    console.log(data)

    /* const chartSalesData: ChartSalesData = useMemo(() => {
        if (data.salesData.length === 0) return {
            label: 'Sales',
            backgroundColor: 'rgba(162, 222, 208, 1)',
            data: []
        }

        return {
            labels: data.salesData.map((x) => x._id), // 2022/01 2022/03
            datasets: [
                {
                    label: 'Sales',
                    backgroundColor: 'rgba(162, 222, 208, 1)',
                    data: data.salesData.map((x) => x.totalSales),
                },
            ],
        }
    }, [data.salesData]); */


    return (
        <AdminscreenWrapper title="Dashboard">
            <h1>DASHBOARD</h1>


            <div className='grid grid-cols-4 gap-4'>
                <PrintObject title="orders Count" content={ordersCount ?? 'loading...'} />
                <PrintObject title="products Count" content={productsCount ?? 'loading...'} />
                <PrintObject title="users Count" content={usersCount ?? 'loading...'} />
                <PrintObject title="orders Price" content={ordersPrice ?? 'loading...'} />
                <PrintObject title="sales Data" content={salesData ?? 'loading...'} />
                <PrintObject title="error" content={error ?? 'loading...'} />
            </div>
        </AdminscreenWrapper>
    );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen