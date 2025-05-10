import React from 'react';
import MainHeader from '@/app/components/sidebar/MainHeader/MainHeader';
import ProfileContent from './ProfileContent';
import '../../../../globals.css'

const Profile = () => {
    return (
        <div className="flex min-h-screen bg-lightOrange">

            <div className='flex flex-col w-full py-5 '>
                <MainHeader
                    title='..'
                    subtitle='..'
                    goto=''
                    bg="lightOrange"
                    font='24px'
                    paddding={false}
                />
                <div className='ml-28 max-sm:ml-0 md:ml-28  max-sm:pr-0  md:pr-[4rem]  pr-4  mt-5'>
                    <ProfileContent />
                </div>
            </div>
        </div>
    )
}

export default Profile;
