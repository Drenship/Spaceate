import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import { NextPage } from 'next/types';

interface QueryUrl {
    id: string
}

const AdminEditProduct: NextPage = () => {
    const router = useRouter();

    const query: QueryUrl = useMemo(() => {
        return {
            id: ""
        }
    }, [router.query]);

    return (
        <AdminscreenWrapper title="Edit Product">
            <h1>{ query.id }</h1>
        </AdminscreenWrapper>
    );
}

export default AdminEditProduct