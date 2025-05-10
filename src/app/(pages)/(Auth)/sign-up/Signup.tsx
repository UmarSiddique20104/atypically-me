'use client'
import secureLocalStorage from 'react-secure-storage';
import BussinessSignup from './BussinessSignup';
import UserSignup from './UserSignup';
import getAndDecryptCookie from '@/app/lib/auth';

const Signup = () => {
    const role = getAndDecryptCookie("role");
    return (
        <div>
            {role === "user" ? (
                <UserSignup />
            ) : (
                <BussinessSignup />
            )}
        </div>
    );
}

export default Signup
