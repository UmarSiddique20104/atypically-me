"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainHeader from '@/app/components/sidebar/MainHeader/MainHeader';
import Modal from 'react-modal';
import '../../../../globals.css'
import { createHeaders, createRequestOptions, fetchApi } from '@/app/components/utils/Helper';
import { showMessage } from '@/app/components/reuseables/Notification';
import API_ENDPOINTS from '@/app/components/ApiRoutes/apiRoutes';
import getAndDecryptCookie, { clearAllCookies } from '@/app/lib/auth';
import { Loader } from '@/app/components/reuseables/Svgs/Loader';
import { useRouter } from "next/navigation";
import useTokenRedirect from '@/app/components/reuseables/useTokenRedirect';


const Settings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const token = getAndDecryptCookie('AccessToken');
  useTokenRedirect();
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const router = useRouter()

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("DELETE", headers);
    const url = `${API_ENDPOINTS.DELETE_ACCOUNT}`;
    try {
      const result = await fetchApi(url, requestOptions);
      setIsLoading(false);
      showMessage(result?.message, "success",);
      clearAllCookies()
      router.push('/welcome')

    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <div className="loaderScreen">
        <Loader />
      </div>}
      <div className="flex min-h-screen bg-primary">

        <div className='flex flex-col w-full'>
          <MainHeader
            title='Settings'
            subtitle=''
            goto='/home'
            bg="cyanBlue-dark"
            font='24px'
            paddding={true}
          />

          <div className='ml-24 md:ml-24 max-sm:ml-[1.3rem]   mt-5'>
            <div>
              <h1 className="font-montserrat cursor-pointer font-extrabold leading-normal max-lg:px-2 px-16 text-2xl mb-5">Account</h1>
              <div className="border-t-4 border-black border-dotted mt-5me-[23px] pt-5 "></div>
              <div className='pt-8 max-lg:px-2 px-16'>
                <div className='flex justify-between items-center'>
                  <Link href={"/change-password"} className="font-montserrat font-normal leading-[30px] text-[15px] text-black">
                    Change Password
                  </Link>

                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" viewBox="0 0 8 10" fill="none">
                      <path d="M7.72701 5.52829L2.46079 9.77962C2.09681 10.0735 1.50823 10.0735 1.14811 9.77962L0.272991 9.07315C-0.0909971 8.77931 -0.0909971 8.30416 0.272991 8.01344L4.00581 5L0.272991 1.98656C-0.090997 1.69272 -0.090997 1.21757 0.272991 0.926852L1.14811 0.220383C1.5121 -0.0734596 2.10068 -0.0734596 2.46079 0.220383L7.72701 4.47171C8.091 4.7593 8.091 5.23445 7.72701 5.52829Z" fill="black" />
                    </svg>
                  </div>
                </div>

                <div className='flex justify-between items-center pt-4'>
                  <Link href={"privacy-&-policy"}>
                    <h1 className="font-montserrat font-normal leading-[30px] text-[15px] text-black">
                      Privacy
                    </h1>
                  </Link>

                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" viewBox="0 0 8 10" fill="none">
                      <path d="M7.72701 5.52829L2.46079 9.77962C2.09681 10.0735 1.50823 10.0735 1.14811 9.77962L0.272991 9.07315C-0.0909971 8.77931 -0.0909971 8.30416 0.272991 8.01344L4.00581 5L0.272991 1.98656C-0.090997 1.69272 -0.090997 1.21757 0.272991 0.926852L1.14811 0.220383C1.5121 -0.0734596 2.10068 -0.0734596 2.46079 0.220383L7.72701 4.47171C8.091 4.7593 8.091 5.23445 7.72701 5.52829Z" fill="black" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            <div className='pt-20'>
              <h1 className="font-montserrat cursor-pointer font-extrabold leading-normal max-lg:ps-2 ps-16 text-2xl">Notification</h1>
              <div className="border-t-4 border-black border-dotted mt-5 pe-[23px] pt-5 "></div>
              <div className='pt-8 max-lg:px-2 px-16'>
                <div className='flex justify-between items-center'>
                  <Link href={'/notifications'}>
                    <h1 className="font-montserrat font-normal leading-[30px] text-[15px] text-black">
                      App Notification
                    </h1>
                  </Link>

                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" viewBox="0 0 8 10" fill="none">
                      <path d="M7.72701 5.52829L2.46079 9.77962C2.09681 10.0735 1.50823 10.0735 1.14811 9.77962L0.272991 9.07315C-0.0909971 8.77931 -0.0909971 8.30416 0.272991 8.01344L4.00581 5L0.272991 1.98656C-0.090997 1.69272 -0.090997 1.21757 0.272991 0.926852L1.14811 0.220383C1.5121 -0.0734596 2.10068 -0.0734596 2.46079 0.220383L7.72701 4.47171C8.091 4.7593 8.091 5.23445 7.72701 5.52829Z" fill="black" />
                    </svg>
                  </div>
                </div>


              </div>

            </div>

            <div className='flex items-center gap-2 mt-[20px] max-lg:px-2 px-16 cursor-pointer' onClick={handleOpenModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" viewBox="0 0 13 16" fill="none">
                <path d="M0.928571 14.5C0.928571 14.8978 1.07532 15.2794 1.33653 15.5607C1.59774 15.842 1.95202 16 2.32143 16H10.6786C11.048 16 11.4023 15.842 11.6635 15.5607C11.9247 15.2794 12.0714 14.8978 12.0714 14.5V4H0.928571V14.5ZM8.82143 6.5C8.82143 6.36739 8.87034 6.24022 8.95741 6.14645C9.04449 6.05268 9.16258 6 9.28571 6C9.40885 6 9.52694 6.05268 9.61401 6.14645C9.70109 6.24022 9.75 6.36739 9.75 6.5V13.5C9.75 13.6326 9.70109 13.7598 9.61401 13.8536C9.52694 13.9473 9.40885 14 9.28571 14C9.16258 14 9.04449 13.9473 8.95741 13.8536C8.87034 13.7598 8.82143 13.6326 8.82143 13.5V6.5ZM6.03572 6.5C6.03572 6.36739 6.08463 6.24022 6.1717 6.14645C6.25877 6.05268 6.37686 6 6.5 6C6.62314 6 6.74123 6.05268 6.8283 6.14645C6.91537 6.24022 6.96429 6.36739 6.96429 6.5V13.5C6.96429 13.6326 6.91537 13.7598 6.8283 13.8536C6.74123 13.9473 6.62314 14 6.5 14C6.37686 14 6.25877 13.9473 6.1717 13.8536C6.08463 13.7598 6.03572 13.6326 6.03572 13.5V6.5ZM3.25 6.5C3.25 6.36739 3.29892 6.24022 3.38599 6.14645C3.47306 6.05268 3.59115 6 3.71429 6C3.83742 6 3.95551 6.05268 4.04259 6.14645C4.12966 6.24022 4.17857 6.36739 4.17857 6.5V13.5C4.17857 13.6326 4.12966 13.7598 4.04259 13.8536C3.95551 13.9473 3.83742 14 3.71429 14C3.59115 14 3.47306 13.9473 3.38599 13.8536C3.29892 13.7598 3.25 13.6326 3.25 13.5V6.5ZM12.5357 1.00001H9.05357L8.7808 0.41563C8.72302 0.290697 8.63402 0.185606 8.5238 0.11218C8.41358 0.0387537 8.28652 -9.46239e-05 8.15692 5.47897e-06H4.84018C4.71087 -0.00052985 4.58403 0.0381736 4.47421 0.111682C4.36438 0.18519 4.276 0.290529 4.2192 0.41563L3.94643 1.00001H0.464286C0.341149 1.00001 0.223057 1.05268 0.135986 1.14645C0.0489157 1.24022 0 1.3674 0 1.50001L0 2.5C0 2.63261 0.0489157 2.75979 0.135986 2.85356C0.223057 2.94733 0.341149 3 0.464286 3H12.5357C12.6589 3 12.7769 2.94733 12.864 2.85356C12.9511 2.75979 13 2.63261 13 2.5V1.50001C13 1.3674 12.9511 1.24022 12.864 1.14645C12.7769 1.05268 12.6589 1.00001 12.5357 1.00001Z" fill="#BD1111" />
              </svg>
              <h1 className="font-montserrat font-bold leading-normal text-[#BD1111] text-xl max-sm:text-base capitalize">
                Delete Account
              </h1>
            </div>
          </div>
        </div>
        {/* Modal */}

        {isModalOpen &&
          <div className='ModelView'>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={handleCloseModal}
              contentLabel="Delete Account Modal"
              className="modal flex justify-center items-center min-h-screen">
              <div className="flex justify-center items-center">
                <div className="modal-content bg-primary w-[500px] h-[434px] rounded-[20px] flex flex-col items-center pt-11">
                  <svg xmlns="http://www.w3.org/2000/svg" width="81" height="80" viewBox="0 0 81 80" fill="none">
                    <path d="M52.3711 35.8547C48.2876 38.5005 46.9004 44.6588 46.6801 47.3514C45.2249 58.8985 36.5898 56.7274 32.6747 61.3818C28.7596 66.0363 31.0334 72.7387 36.8358 75.6282C49.2889 81.3234 60.7749 80.0693 69.4706 69.8207C77.9715 58.9314 73.5206 45.8939 68.8828 40.6579C65.6995 37.0639 58.3409 31.9867 52.3711 35.8547Z" fill="#E59261" />
                    <path d="M18.2156 24.2024C18.8323 21.5015 21.1193 18.3929 22.7055 16.566C24.8203 14.1301 25.0518 11.6151 25.0005 9.84555C24.9491 8.07604 23.3163 4.59726 19.0791 3.66171C15.6894 2.91326 12.7535 4.53193 11.7014 5.62385C7.92457 9.12771 2.75589 18.2504 1.84537 24.6503C0.595642 33.4345 4.89166 41.9469 9.9426 47.4613C14.9935 52.9757 27.4842 58.0454 37.1961 54.414C46.908 50.7826 51.7089 44.2937 52.6355 43.1965C53.5621 42.0993 54.4447 39.4871 54.5188 37.7229C54.593 35.9587 52.8929 31.0884 47.8971 30.2472C43.9004 29.5742 41.8194 31.6345 40.7493 32.724C39.3228 34.1763 36.6161 37.5257 32.8487 38.5793C28.1395 39.8962 24.6217 39.3679 20.7575 35.5445C16.8933 31.7211 17.4448 27.5784 18.2156 24.2024Z" fill="#F3D146" />
                    <path d="M24.3102 7.91604C29.1501 4.7866 34.0944 7.65133 35.8827 8.98826C38.1718 10.6997 40.1344 15.345 38.5356 19.4885C36.9005 23.7263 32.6493 27.9641 26.2724 29.431C19.8955 30.8979 17.1158 25.6822 16.7888 22.0964C16.4618 18.5105 18.2604 11.8279 24.3102 7.91604Z" fill="#C5B5D3" />
                    <path d="M70.1629 7.56896C61.9472 0.947906 51.7301 0.154302 47.5131 0.959592C44.8837 1.46171 42.1412 3.26423 41.2205 6.44668C40.0696 10.4247 41.5612 12.6114 42.9177 13.5824C44.0029 14.3593 46.5588 14.6016 48.2054 14.7154C49.6222 14.8133 51.154 15.4674 52.1399 16.4129C53.1259 17.3583 53.4999 18.9194 53.7699 21.3507C53.9118 25.6374 57.0273 28.0946 59.7102 28.8892C61.9637 29.5567 63.2917 29.356 65.832 30.6282C68.3724 31.9003 69.3642 33.3945 70.2697 34.5537C71.1752 35.7129 73.7851 35.9775 75.58 35.3592C77.9133 34.5554 78.7503 31.74 78.8771 30.4328C79.3956 25.5703 78.3786 14.19 70.1629 7.56896Z" fill="#AFCBA2" />
                    <path d="M3.33151 52.898C5.43905 51.4168 7.54269 51.4617 9.08821 51.9489C10.6337 52.4362 12.5852 53.8979 13.756 55.7493C15.0087 57.7301 15.6255 60.109 18.1623 62.6426C20.6992 65.1763 22.7326 64.9093 24.684 66.4685C26.6354 68.0276 26.1632 70.3409 25.6753 71.6077C25.1875 72.8745 22.9433 74.8235 18.8453 74.8235C14.7474 74.8235 8.86185 72.6737 5.75518 69.4893C2.04747 65.6889 0.599511 61.4733 0.50194 59.4269C0.404368 57.3805 0.697082 54.7495 3.33151 52.898Z" fill="#95ABCC" />
                  </svg>
                  <div className='pt-6'>
                    <h2 className="text-black text-center font-montserrat font-bold leading-6 text-sm leading-24">Are you sure<br />you want to delete your account<br />permanently?</h2>
                    <p className="text-black text-center font-montserrat font-normal text-[10px] leading-normal pt-[14px]">Deleting this app will also delete it’s data!</p>
                  </div>
                  <div className="flex justify-center gap-4 mt-9">
                    <button onClick={() => setIsModalOpen(false)} className="bg-black text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid  border-black ">Cancel</button>
                    <button onClick={handleDeleteAccount} className="bg-orange-darker text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid  border-black ">Delete</button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        }


      </div>

    </>
  )
}

export default Settings;