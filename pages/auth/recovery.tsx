import React, { useEffect, useState } from 'react';
import { NextPage } from 'next/types';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { fetchPostJSON } from '@libs/utils/api-helpers';
import BasescreenWrapper from '@components/Layouts/BasescreenLayout';

const Recovery: NextPage = () => {

    const { data: session } = useSession();

    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || '/');
        }
    }, [router, session, redirect]);

    const [email, setEmail] = useState<string | undefined>(undefined)

    const recoveryPasswordSendEmail = async () => {
        const result = await fetchPostJSON("/api/mailer", {
            emailType: 'RECOVERY_PASSWORD',
            user: {
                email: email
            }
        })
    }
    
    return (
        <BasescreenWrapper title={"Se connecter"}>
            <div className='min-h-[calc(100vh-64px)] flex items-center justify-center'>

            </div>
        </BasescreenWrapper>
    );
}

export default Recovery