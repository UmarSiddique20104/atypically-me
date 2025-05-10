'use client'
import Button from '@/app/components/reuseables/Svgs/Button';
import Link from 'next/link';
import PaperPlan from '@/app/components/reuseables/Svgs/PaperPlan';
import UpdatePasswordStar from '@/app/components/reuseables/Svgs/UpdatePasswordStar';
import Arrow from '@/app/components/reuseables/Svgs/Arrow';
import CustomHeading from '@/app/components/reuseables/CustomHeading';
import  "../../../globals.css"

const PasswordSuccess = () => {
    return (
        <div className='bg-cyanBlue min-h-svh flex flex-col justify-center items-center relative'>
            <div className='absolute max-md:bottom-[0%] max-2xl:bottom-[20%] bottom-[20%] right-0 max-sm:pr-4 pr-12 pb-12'>
                <UpdatePasswordStar />
            </div>
            <div>
                <div className='flex justify-center'>
                    <Arrow />
                </div>
                <div className=' pt-[85px] max-lg:pt-[15px]'>
                    <CustomHeading FontWeight={700} title="Password Updated" />
                    <h1 className='font-montserrat font-[700]
                     leading-normal max-sm:text-[12px] text-[16px] text-black text-center max-sm:px-5'>Your Password has been updated successfully!</h1>
                </div>
                <div className='text-center pt-[19px]'>
                    <div className='pt-[40px]'>
                        <Link href={'/sign-in'} >
                            <Button>
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='absolute bottom-[3%] left-[5%] right-0 pr-12 pb-3'>
                <PaperPlan />
            </div>
        </div>
    );
};

export default PasswordSuccess;
