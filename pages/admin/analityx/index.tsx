import React, { useState } from 'react';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'

function AdminAnalityxScreen() {

    const [checkAll, setcheckAll] = useState(false);

    return (
        <AdminscreenWrapper title="Analityx">
            <h1 className='text-xl font-bold uppercase'>Analityx</h1>


        </AdminscreenWrapper>
    );
}

AdminAnalityxScreen.auth = { adminOnly: true };
export default AdminAnalityxScreen
