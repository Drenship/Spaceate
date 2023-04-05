import React from 'react';
import AdminscreenWrapper from '@components/Layouts/AdminscreenLayout';

function AdminOrdersIdScreen() {
    return (
        <AdminscreenWrapper title="Orders">

        </AdminscreenWrapper>
    );
}


AdminOrdersIdScreen.auth = { adminOnly: true };
export default AdminOrdersIdScreen