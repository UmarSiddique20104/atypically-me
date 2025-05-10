'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { createHeaders, createRequestOptions, fetchApi } from '../../utils/Helper';
import { showMessage } from '../../reuseables/Notification';
import getAndDecryptCookie from '@/app/lib/auth';
import API_ENDPOINTS from '../../ApiRoutes/apiRoutes';
import TreatsDropdown from '../../reuseables/TreatsDropdown';

interface TreatsHeaderProps {
    goto: string;
    onSelectedOptionChange: (option: string) => void;
}

const TreatsHeader: React.FC<TreatsHeaderProps> = ({ goto, onSelectedOptionChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState<any>([]);
    const token = getAndDecryptCookie("AccessToken");
    const [selectedOption, setSelectedOption] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSvgClick = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const GetCategories = async () => {
        setIsLoading(true);
        const headers = createHeaders(token ?? "");
        const requestOptions = createRequestOptions("GET", headers);
        const url = `${API_ENDPOINTS.GETCATEGORY}`;
        try {
            const result = await fetchApi(url, requestOptions);
            if (result?.success && result?.status === 200) {
                const categories = result.data.map(
                    (category: { category: string }) => category.category
                );
                setCategory(categories);
                setIsLoading(false);
            } else {
                showMessage(result?.message, "error");
                console.error("API Response Error:", result);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("GetDeals error:", error);
            setIsLoading(false);
        }
    };

    const handleClickFunction = (option: any) => {
        setSelectedOption(option);
        onSelectedOptionChange(option);
    };

    useEffect(() => {
        GetCategories()
    }, []);

    useEffect(() => {
        onSelectedOptionChange(selectedOption);
    }, [selectedOption, onSelectedOptionChange]);
    return (
        <div className='fixed top-0 left-0 w-full z-10 bg-black sm:pt-10 p-1 ps-24 max-sm:pt-20  max-sm:ps-3 pe-3 pb-4'>
            <div className='flex justify-between items-center px-4 cursor-pointer'>
                <Link href={goto} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                        <path d="M0.477736 8.04908L9.69361 0.396686C10.3306 -0.132229 11.3606 -0.132229 11.9908 0.396686L13.5223 1.66833C14.1592 2.19725 14.1592 3.05252 13.5223 3.5758L6.98983 9L13.5223 14.4242C14.1592 14.9531 14.1592 15.8084 13.5223 16.3317L11.9908 17.6033C11.3538 18.1322 10.3238 18.1322 9.69361 17.6033L0.477736 9.95092C-0.159244 9.43326 -0.159244 8.57799 0.477736 8.04908Z" fill="white" />
                    </svg>
                </Link>
                <div >
                    <svg
                        className='max-sm:w-[170px] max-md:w-[150px] max-lg:w-[180px] max-xl:w-[259px] max-2xl-[259px] '
                        width="259" height="89" viewBox="0 0 259 89" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M89.4676 73.5071L80.2244 72.6788L73.9812 61.6774L73.5562 61.6393L66.066 60.9681L65.1377 71.3269L56.532 70.5558L59.8641 33.3703L75.9601 34.8127C85.8939 35.7028 91.6474 41.4126 90.9001 49.7528C90.4003 55.3306 87.2183 59.1687 82.1985 60.8073L89.4676 73.5071ZM82.1881 48.9721C82.5546 44.8817 80.1127 42.2532 74.8536 41.7819L67.8415 41.1536L66.68 54.1154L73.6921 54.7437C78.9512 55.215 81.8263 53.0094 82.1881 48.9721Z" fill="#95ABCC" />
                        <path d="M177.767 70.4147L181.317 40.3293L169.453 38.929L170.278 31.9373L202.588 35.7505L201.763 42.7422L189.898 41.342L186.348 71.4274L177.767 70.4147Z" fill="#E59261" />
                        <path d="M38.2149 72.1115L33.887 42.128L22.0625 43.8348L21.0567 36.8668L53.2573 32.2188L54.2631 39.1868L42.4386 40.8936L46.7665 70.8771L38.2149 72.1115Z" fill="#E59261" />
                        <path d="M105.284 63.8242L125.57 62.6411L125.974 69.5629L97.1152 71.246L94.9415 33.9749L123.108 32.3322L123.512 39.254L103.918 40.3967L104.39 48.4898L121.694 47.4806L122.085 54.1894L104.781 55.1986L105.284 63.8242Z" fill="#AFCBA2" />
                        <path d="M162.858 67.2846L159.989 59.1172L142.68 58.1796L138.946 65.9892L130.105 65.5103L148.741 29.1307L157.262 29.5923L171.911 67.7751L162.858 67.2846ZM145.804 51.779L157.627 52.4195L152.489 37.8264L145.804 51.779Z" fill="#F3D146" />
                        <path d="M217.335 71.5206C211.456 70.8267 205.73 68.3787 202.746 65.4487L206.421 59.3305C209.278 61.9769 213.751 64.116 218.201 64.6411C223.285 65.2412 225.551 63.7901 225.82 61.5125C226.639 54.5738 204.519 56.7966 206.144 43.0251C206.888 36.722 212.591 32.0783 223.132 33.3223C227.793 33.8724 232.429 35.5473 235.615 38.1253L232.198 44.3277C228.987 41.9616 225.55 40.5894 222.266 40.2018C217.181 39.6017 214.997 41.2772 214.722 43.6078C213.915 50.4406 236.029 48.2707 234.423 61.8833C233.691 68.0805 227.928 72.7708 217.335 71.5206Z" fill="#C5B5D3" />
                        <path d="M94.0773 19.1964C91.9369 19.1964 89.7966 18.5287 88.6576 17.5469L89.5413 15.5636C90.6409 16.4473 92.3886 17.0756 94.0773 17.0756C96.2177 17.0756 97.121 16.3098 97.121 15.2887C97.121 12.3236 88.9522 14.2676 88.9522 9.1621C88.9522 6.94317 90.7195 5.05807 94.4897 5.05807C96.1392 5.05807 97.8672 5.49007 99.065 6.27553L98.2599 8.25882C97.0228 7.53227 95.6679 7.17881 94.4701 7.17881C92.3493 7.17881 91.4853 8.00355 91.4853 9.04428C91.4853 11.9701 99.6345 10.0654 99.6345 15.112C99.6345 17.3113 97.8475 19.1964 94.0773 19.1964ZM107.743 8.39628C110.806 8.39628 113.064 10.517 113.064 13.757C113.064 17.0167 110.806 19.1375 107.743 19.1375C106.407 19.1375 105.229 18.6858 104.385 17.7236V22.8095H101.93V8.5141H104.267V9.88865C105.092 8.88719 106.309 8.39628 107.743 8.39628ZM107.468 17.0363C109.235 17.0363 110.57 15.76 110.57 13.757C110.57 11.7541 109.235 10.4777 107.468 10.4777C105.7 10.4777 104.345 11.7541 104.345 13.757C104.345 15.76 105.7 17.0363 107.468 17.0363ZM125.249 13.816C125.249 14.0123 125.23 14.3069 125.21 14.5425H116.982C117.277 16.0742 118.553 17.056 120.38 17.056C121.558 17.056 122.481 16.6829 123.227 15.9171L124.542 17.4291C123.6 18.5484 122.127 19.1375 120.321 19.1375C116.806 19.1375 114.528 16.8793 114.528 13.757C114.528 10.6348 116.825 8.39628 119.948 8.39628C123.011 8.39628 125.249 10.5367 125.249 13.816ZM119.948 10.3599C118.357 10.3599 117.198 11.381 116.963 12.9127H122.913C122.716 11.4007 121.558 10.3599 119.948 10.3599ZM132.418 19.1375C129.1 19.1375 126.743 16.8989 126.743 13.757C126.743 10.6152 129.1 8.39628 132.418 8.39628C134.46 8.39628 136.09 9.24065 136.895 10.8312L135.01 11.9309C134.382 10.9294 133.439 10.4777 132.398 10.4777C130.592 10.4777 129.217 11.7345 129.217 13.757C129.217 15.7992 130.592 17.0363 132.398 17.0363C133.439 17.0363 134.382 16.5847 135.01 15.5832L136.895 16.6829C136.09 18.2538 134.46 19.1375 132.418 19.1375ZM140.254 6.78608C139.351 6.78608 138.683 6.13808 138.683 5.31334C138.683 4.48861 139.351 3.8406 140.254 3.8406C141.157 3.8406 141.825 4.44934 141.825 5.25443C141.825 6.11844 141.177 6.78608 140.254 6.78608ZM139.017 19V8.5141H141.472V19H139.017ZM148.699 8.39628C151.723 8.39628 153.471 9.82974 153.471 12.8538V19H151.154V17.7236C150.565 18.6269 149.426 19.1375 147.855 19.1375C145.459 19.1375 143.947 17.8218 143.947 15.9956C143.947 14.248 145.125 12.8734 148.306 12.8734H151.016V12.7163C151.016 11.2828 150.152 10.4385 148.405 10.4385C147.226 10.4385 146.009 10.8312 145.223 11.4792L144.261 9.69229C145.38 8.82828 147.01 8.39628 148.699 8.39628ZM148.365 17.3505C149.563 17.3505 150.604 16.8007 151.016 15.7207V14.5032H148.483C146.814 14.5032 146.362 15.1316 146.362 15.8974C146.362 16.7811 147.109 17.3505 148.365 17.3505ZM156.621 19V4.4297H159.075V19H156.621Z" fill="white" />
                    </svg>
                </div>
                <div>
                </div>
            </div>

            <div className='flex justify-center  cursor-pointer flex-wrap items-center gap-5 max-sm:gap-3 pt-[35px] max-sm:pt-[0px]'>
                <Link href={'business-suggesions'} className='text-black p-3 font-bold bg-yellow rounded-[30px]
        max-sm:text-[14px] font-montserrat max-xl:text-lg max-2xl:text-lg max-md:text-[15px] max-lg:text-[15px]
        lg:w-[230px] max-lg:w-full  text-center'>
                    Suggest a Business
                </Link>
                <div className="relative lg:w-[483px]  w-full">
                    <input
                        type="text"
                        placeholder="Categories..."
                        className="rounded-[30px] font-roboto font-medium placeholder:font-bold placeholder:text-black text-lg ps-12 border border-stroke bg-purple p-3 pl-6 pr-12 outline-none focus:border-primary focus-visible:shadow-none lg:w-[483px] w-full "
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    />

                    {isDropdownOpen &&
                        <div className="absolute w-full z-50">
                            <TreatsDropdown
                                label=""
                                options={category}
                                active=""
                                handleClick={handleClickFunction}
                                twClass="#ffffff"
                                color="#ffffff"
                                isOpen={isDropdownOpen}
                                setIsOpen={setIsDropdownOpen}
                                filterText={selectedOption}
                                setFilterText={setSelectedOption}
                            />
                        </div>
                    }

                    <span className="absolute left-4 top-[22px] cursor-pointer" onClick={handleSvgClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                            <path d="M11.3159 5.44645L0.602875 10.748L0.602876 0.144864L11.3159 5.44645Z" fill="black" />
                        </svg>
                    </span>

                    <span className="absolute right-4 top-[14px] cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="25" viewBox="0 0 26 25" fill="none">
                            <path d="M25.1393 21.3737L20.3707 16.6059C20.1554 16.3907 19.8637 16.2711 19.5576 16.2711H18.778C20.0981 14.583 20.8825 12.4598 20.8825 10.15C20.8825 4.6553 16.4295 0.203125 10.9339 0.203125C5.43829 0.203125 0.985352 4.6553 0.985352 10.15C0.985352 15.6447 5.43829 20.0968 10.9339 20.0968C13.2441 20.0968 15.3677 19.3126 17.0561 17.9927V18.7722C17.0561 19.0782 17.1757 19.3699 17.3909 19.5851L22.1595 24.3529C22.6091 24.8025 23.3361 24.8025 23.7809 24.3529L25.1345 22.9996C25.5841 22.5501 25.5841 21.8232 25.1393 21.3737ZM10.9339 16.2711C7.55235 16.2711 4.81172 13.5357 4.81172 10.15C4.81172 6.76901 7.54757 4.02884 10.9339 4.02884C14.3155 4.02884 17.0561 6.76422 17.0561 10.15C17.0561 13.531 14.3202 16.2711 10.9339 16.2711Z" fill="#1B1529" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TreatsHeader;
