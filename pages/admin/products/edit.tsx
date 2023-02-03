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
        return query
    }, [router.query]);

    return (
        <AdminscreenWrapper title="Edit Product">
        </AdminscreenWrapper>
    );
}

export default AdminEditProduct