'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Parachute from '@/app/components/reuseables/Svgs/editSvgs/Parachute';
import Crown from '@/app/components/reuseables/Svgs/editSvgs/Crown';
import Star from '@/app/components/reuseables/Svgs/editSvgs/Star';
import Flower from '@/app/components/reuseables/Svgs/editSvgs/Flower';
import '../../../../globals.css';
import { createHeaders, createRequestOptions, fetchApi } from '@/app/components/utils/Helper';
import API_ENDPOINTS from '@/app/components/ApiRoutes/apiRoutes';
import { showMessage } from '@/app/components/reuseables/Notification';
import getAndDecryptCookie from '@/app/lib/auth';
import { Loader } from '@/app/components/reuseables/Svgs/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfiles } from '@/app/redux/userProfileSlice';
import { RootState } from '@/app/redux/store';
import useTokenRedirect from '@/app/components/reuseables/useTokenRedirect';

interface UserProfile {
    isUser?: boolean;
    participants?: {
        userId?: {
            image?: string;
        };
    };
    image?: string;
    nickName?: string;
    aboutMe?: string;
    interests?: string;
    favourites?: string;
}

interface UserData {
    attributes: UserProfile;
}

const UserProfileContent = () => {
    const [usernameEdit, setUsernameEdit] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile>({});
    const [usersDrop, setUsersDrop] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();
    const token = getAndDecryptCookie('AccessToken');
    const role = getAndDecryptCookie('Role');

    const dispatch = useDispatch();
    useTokenRedirect();

    const getRequestDetails = async () => {
        setIsLoading(true);
        const searchParams = new URLSearchParams(window.location.search);
        const name = searchParams.get('name');
        const headers = createHeaders(token ?? "");
        const requestOptions = createRequestOptions("GET", headers);
        const url = `${API_ENDPOINTS.SEARCH_USER}/?nickName=${name}`;

        try {
            const response = await fetchApi(url, requestOptions);
            dispatch(setUserProfiles(response[0]?.data?.attributes));

            if (response.length > 0) {
                setUsersDrop(true);
                setSearchedUsers(response);
                setUserProfile(response?.[0]?.data?.attributes);
                setIsLoading(false);
            } else {
                setUsersDrop(false);
            }
        } catch (error) {
            console.error('GetDeals error:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!token || role != 'user') {
            showMessage('Please login first with user account', 'error')
            setTimeout(() => {
                router.push('/welcome')
            }, 2000)
            setIsLoading(false)
        }
        getRequestDetails();

    }, []);

    return (
        <div>
            {isLoading && <div className="loaderScreen">
                <Loader />
            </div>}
            <div className="max-w-full mx-auto p-6 relative">
                <div className='absolute top-[8%] left-[5%] max-md:hidden'>
                    <Parachute />
                </div>
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/3 mb-[48px] max-sm:md-[0px]">
                        <div className="space-y-6 flex  justify-center items-center">
                            <div className="">
                                <div className="font-montserrat text-[26px] font-extrabold pb-1 leading-normal text-black placeholder:text-black text-center">Profile</div>
                                <div className='rounded-[50%] bg-[#F5F5F5]' >
                                    {userProfile?.image ? (
                                        <div>
                                            <Image
                                                src={userProfile.image}
                                                width={225}
                                                height={225}
                                                className="w-[225.688px] rounded-[13.198px] h-[225.688px]"
                                                alt={".."}
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <div className='text-center'>
                                            <Image
                                                src={'/assets/images/noimgpic.jpeg'}
                                                className="w-[225.688px] rounded-[13.198px] h-[225.688px]"
                                                width={225}
                                                height={225}
                                                alt={".."}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className='flex items-center justify-center pt-2 gap-1'>
                                    <div className={`font-montserrat ps-2 placeholder:text-sm place text-lg focus:outline-none font-medium  w-20 leading-normal text-black placeholder:text-black border-none ${usernameEdit ? 'bg-white' : 'bg-transparent'}`}>
                                        {userProfile?.nickName}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='absolute left-[4%]  max-md:hidden'>
                        <Star />
                    </div>
                    <div className='absolute right-[65%] 2xl:right-[70%] md:2xl:right-[70%]  max-md:hidden'>
                        <Flower />
                    </div>
                    <div className="md:w-2/3 md:pl-12 max-sm:pt-5">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold flex items-center space-x-2 pb-3">
                                    <span className=" font-montserrat text-[26px]  font-extrabold leading-normal text-black placeholder:text-black ">About me</span>
                                </h3>
                                <div className="  ">
                                    <div className='flex items-center justify-center pt-2 gap-1'>
                                        <div className={`w-full h-36 border rounded-[18px] p-5 focus:outline-none
                      font-montserrat text-lg font-medium leading-normal text-black bg-orange-darker placeholder:text-black`}>
                                            {userProfile?.aboutMe}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Image src={'/assets/images/line.png'} alt='line' width={645} height={0} className='py-5 text-center w-full' />
                            <div>
                                <h3 className="text-lg font-semibold flex items-center space-x-2 pb-3">
                                    <span className=" font-montserrat text-[26px] font-extrabold  leading-normal text-black placeholder:text-black ">Interests</span>
                                </h3>
                                <div className="  ">
                                    <div className='flex items-center justify-center pt-2 gap-1'>
                                        <div className={`w-full h-36 border rounded-[18px] p-5 focus:outline-none
                      font-montserrat text-lg font-medium leading-normal text-black bg-yellow placeholder:text-black `}>
                                            {userProfile?.interests}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Image src={'/assets/images/line.png'} alt='line' width={645} height={0} className='py-5 text-center w-full' />
                            <div>
                                <h3 className="text-lg font-semibold flex items-center  space-x-2 pb-3">
                                    <span className=" font-montserrat text-[26px] font-extrabold leading-normal text-black placeholder:text-black ">Favourite places</span>
                                </h3>
                                <div className="">
                                    <div className='flex items-center justify-center pt-2 gap-1'>
                                        <div className={`w-full h-36 border rounded-[18px] p-5 focus:outline-none
                      font-montserrat text-lg font-medium leading-normal text-black bg-green placeholder:text-black `}>
                                            {userProfile?.favourites}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='absolute bottom-[5%] left-[5%]  max-md:hidden'>
                    <Crown />
                </div>
            </div>
        </div>
    );
};

export default UserProfileContent;
