import React from 'react';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper';

function AdminOrdersIdScreen() {
    return (
        <AdminscreenWrapper title="Orders">

        </AdminscreenWrapper>
    );
}


AdminOrdersIdScreen.auth = { adminOnly: true };
export default AdminOrdersIdScreen