import React from 'react';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import { fetchGetJSON } from '@libs/utils/api-helpers';
import PrintObject from '@components/PrintObject';

function AdminDashboardScreen() {

    const { data, error } = useSWR("/api/admin/summary", fetchGetJSON);
    
    return (
        <AdminscreenWrapper title="Dashboard">
            <h1>DASHBOARD</h1>
            <PrintObject content={data ?? 'loading...'} />
        </AdminscreenWrapper>
    );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen