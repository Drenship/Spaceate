import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchPostJSON } from '@libs/utils/api-helpers';

const VerifyEmail = () => {
    const router = useRouter();
    const { token } = router.query;

    const [message, setMessage] = useState("Verifying email...")

    useEffect(() => {
        if (token) {
            verifyEmail(token);
        }
    }, [token]);

    const verifyEmail = async (token: string) => {
        try {
            const result = await fetchPostJSON(`/api/user/verify-email/${token}`, { token });
            setMessage(result.message);
            router.push('/');
        } catch (error) {
            const err = error as Error;
            setMessage(err.message || 'An error occurred during email verification.');
        }
    };

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default VerifyEmail;
