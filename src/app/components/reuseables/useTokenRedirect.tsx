import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getAndDecryptCookie from '@/app/lib/auth';

const useTokenRedirect = () => {
    const router = useRouter();
    const token = getAndDecryptCookie("AccessToken");
    console.log('token', token)
    useEffect(() => {
        if (!token) {
            router.push('/welcome');
        }
    }, [token, router]);
};

export default useTokenRedirect;
