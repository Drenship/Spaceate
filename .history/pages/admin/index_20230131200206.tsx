import React from 'react';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import { fetchGetJSON } from '@libs/utils/api-helpers';
import PrintObject from '@components/PrintObject';
import useSWR from 'swr';

function AdminDashboardScreen() {

    const { data: {
        ordersCount,
        productsCount,
        usersCount,
        ordersPrice,
        salesData
    }, error } = useSWR("/api/admin/summary", fetchGetJSON);

    const data = {
        labels: salesData.map((x) => x._id), // 2022/01 2022/03
        datasets: [
            {
                label: 'Sales',
                backgroundColor: 'rgba(162, 222, 208, 1)',
                data: salesData.map((x) => x.totalSales),
            },
        ],
    };

    console.log(data)

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