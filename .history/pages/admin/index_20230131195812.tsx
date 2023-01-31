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
    
    return (
        <AdminscreenWrapper title="Dashboard">
            <h1>DASHBOARD</h1>
            <div className='grid grid-cols-4 gap-4'>
                <PrintObject content={ordersCount ?? 'loading...'} />
                <PrintObject content={productsCount ?? 'loading...'} />
                <PrintObject content={usersCount ?? 'loading...'} />
                <PrintObject content={ordersPrice ?? 'loading...'} />
                <PrintObject content={salesData ?? 'loading...'} />
                <PrintObject content={error ?? 'loading...'} />
            </div>
        </AdminscreenWrapper>
    );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen