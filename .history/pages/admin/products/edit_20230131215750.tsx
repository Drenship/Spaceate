import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'

interface QueryUrl {
    id: string
}

export default function edit() {
    const router = useRouter();

    const query: QueryUrl = useMemo(() => {
        return query
    }, [router.query]);

    return (
        <AdminscreenWrapper title="Edit Product">
        </AdminscreenWrapper>
    );
}