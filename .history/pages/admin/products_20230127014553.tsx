import React from 'react';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'

function AdminProductsScreen() {
    return (
        <AdminscreenWrapper title="Products">
            <h1>Products</h1>
        </AdminscreenWrapper>
    );
}

AdminProductsScreen.auth = { adminOnly: true };
export default AdminProductsScreen