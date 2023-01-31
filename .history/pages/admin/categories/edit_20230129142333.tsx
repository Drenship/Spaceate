import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'

export default function edit() {
    const router = useRouter();

    //const query = router.query
    //console.log(query)
    
    const d = useMemo(() => {
        console.log(router.query)
        return 'ok'
    }, [router.query]);

    return (
        <AdminscreenWrapper title="Edit categorie">

        </AdminscreenWrapper>
    );
}
