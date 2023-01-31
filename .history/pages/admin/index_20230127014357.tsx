import React from 'react';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'

function AdminDashboardScreen() {
    return (
        <AdminscreenWrapper title="Dashboard">
            <h1>DASHBOARD</h1>
        </AdminscreenWrapper>
    );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen