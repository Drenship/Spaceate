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
            <PrintObject content={ordersCount ?? 'loading...'} />
        </AdminscreenWrapper>
    );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen