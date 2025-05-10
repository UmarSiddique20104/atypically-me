"use client"
import React, { useEffect, useRef, useState } from "react";

import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import "../../../../globals.css";
import { createHeaders, createRequestOptions, fetchApi, getUserByEmail, sendFriendRequest } from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import getAndDecryptCookie from "@/app/lib/auth";
import _ from 'lodash';
import Image from "next/image";
import Modal from "react-modal";
import { showMessage } from "@/app/components/reuseables/Notification";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
interface User {
  id: string;
  image: string;
  email: string;
  friendRequestStatus: boolean;
}

interface UserData {
  attributes: {
    email: string;
    nickName: string;
    image: string;
    Id: string;
    friendRequest: boolean;
  };
}

interface SuccessResponse {
  data: UserData;
}

interface ErrorResponse {
  message: string;
}


interface Props {
  user: User | null;
  handleFriendRequest: (id: string) => void;
}
interface UserData {
  attributes: {
    email: string;
    nickName: string;
    image: string;
    Id: string;
    friendRequest: boolean;
  };
}

interface User {
  id: string;
  email: string;
  image: string;
  firstName: string;
  lastName: string;
  nickName: string;
  friendRequestStatus: boolean;
}

interface SuccessResponse {
  data: UserData;
}

interface ErrorResponse {
  message: string;
}

interface UserData {
  data: {
    attributes: {
      firstName: string;
      lastName: string;
      nickName: string;
    }
  }
}
const AddFriend = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("")
  const [searchedUsers, setSearchedUsers] = useState<UserData[]>([]);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User>({
    id: '',
    email: '',
    image: '',
    friendRequestStatus: false,
    firstName: "",
    lastName: "",
    nickName: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usersDrop, setUsersDrop] = useState(false);

  const token = getAndDecryptCookie('AccessToken');
  const modalRef = useRef<HTMLDivElement>(null);
  useTokenRedirect();


  const handleNameInput = _.debounce((item) => {
    getRequestDetails(item)
  }, 500);
  const handleUserClick = (item: any) => {
    setUsername(item.data.attributes.nickName);
    handleNameSearch();
    setUser({
      ...user,
      email: item?.data?.attributes?.email,
      nickName: item?.data?.attributes?.nickName,
      image: item?.data?.attributes?.image,
      id: item.data?.attributes?.Id,
      friendRequestStatus: item?.data?.attributes?.friendRequest,
    });
    setUsersDrop(false);
  };

  const handleNameSearch = async () => {
    if (user === null) {
      showMessage("No User Found", "error");
    } else {
      setIsModalOpen(true);
    }
  };


  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);



  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async () => {
    
    if (email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      setIsLoading(true);
      try {
        const response = await getUserByEmail(email);

        //@ts-ignore
        if (!response?.data?.data || !response?.data?.data.attributes) {
          setIsLoading(false);
          showMessage("No User Found", "error");
          return;
        }
        setUser({
          ...user,
          //@ts-ignore
          email: response.data.data.attributes.email,
          //@ts-ignore
          nickName: response.data.data.attributes.nickName,
          //@ts-ignore
          image: response.data.data.attributes.image,
          //@ts-ignore
          id: response.data.data.attributes.Id,
          //@ts-ignore
          friendRequestStatus: response.data.data.attributes.friendRequest,
        });

        setIsLoading(false);
        setIsModalOpen(true);
      } catch (err) {
        setIsLoading(false);
        showMessage((err as ErrorResponse).message || "Error occurred while searching", "error");
      }
    } else {
      showMessage("Please enter a valid email", 'error');
    }
  };




  const getRequestDetails = async (item: any) => {
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.SEARCH_USER}/?nickName=${item}`;

    try {
      const response = await fetchApi(url, requestOptions);
      if (response.length > 0) {
        setUsersDrop(true);
        setSearchedUsers(response);
        setIsLoading(false);
      } else {
        setUsersDrop(false);
      }

    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);

    }
  };

  const handleFriendRequest = (recieverId: string) => {
    setIsLoading(true);
    sendFriendRequest(recieverId)
      .then((res) => {
        showMessage("Friend request sent Successfully", "success");
        setUsername("")
        setEmail('')
        setIsModalOpen(false);
        setIsLoading(false);
      })
      .catch((error: any) => {
        console.log('error', error)

        showMessage(error?.error[0]?.title, "error");
        setIsModalOpen(false);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <div className="loaderScreen"><Loader /></div>}

      <div className="flex h-screen bg-primary">
        {/* Sidebar */}

        <div className="flex flex-col w-full">
          <MainHeader
            title="Add a Friend"
            subtitle=""
            goto="/home"
            bg="green"
            font="24px"
            paddding={true}
          />
          <div className="ml-28 flex justify-center  items-center md:ml-ml-28 max-sm:ml-[1.3rem] md:pr-[4rem] pr-4 pb-2">
            <div className="max-lg:px-2  pt-[52px]">
              <div className="md:pt-10 pt-0 relative text-center">
                <div className="relative text-center">
                  <h1 className="font-montserrat font-extrabold  text-black leading-normal text-xl max-sm:text-base ">
                    Add a Friend via User name :
                  </h1>
                  <input
                    className="px-[10px] py-[10px] text-center rounded-[48px] w-[70vw] 
                            sm:w-[421px] font-montserrat font-medium
                            leading-normal  pe-12  text-[15px] placeholder-black mt-5"
                    required
                    placeholder={"User Name"}
                    type={"text"}
                    name={"username"}
                    value={username}
                    onChange={(text) => { handleNameInput(text.target.value), setUsername(text.target.value); }}

                  />
                  {!isLoading && usersDrop && searchedUsers && searchedUsers.length > 0 ? (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-2 max-h-[20vh] overflow-y-auto w-full">
                      {searchedUsers.map((user, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleUserClick(user)}
                        >
                          {/* Ensure user exists before accessing its properties */}
                          {user && user.data && user.data.attributes && (
                            <>
                              {user.data.attributes.firstName} {user.data.attributes.lastName} ({user.data.attributes.nickName})
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ): ""}


                  <div className="absolute max-sm:inset-y-[60px] md:inset-y-[65px] inset-y-[92px]  max-sm:right-[40px] right-[25px] w-[20px] h-[20px] cursor-pointer  max-md:inset-y-[62px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                    >
                      <path
                        d="M18.0773 15.5186L14.5814 12.0232C14.4236 11.8654 14.2097 11.7778 13.9853 11.7778H13.4137C14.3815 10.5402 14.9566 8.98361 14.9566 7.29027C14.9566 3.26202 11.692 -0.00195312 7.6631 -0.00195312C3.63416 -0.00195312 0.369629 3.26202 0.369629 7.29027C0.369629 11.3185 3.63416 14.5825 7.6631 14.5825C9.35672 14.5825 10.9136 14.0075 12.1514 13.0399V13.6114C12.1514 13.8357 12.239 14.0496 12.3968 14.2074L15.8928 17.7027C16.2224 18.0323 16.7554 18.0323 17.0815 17.7027L18.0738 16.7106C18.4034 16.381 18.4034 15.8481 18.0773 15.5186ZM7.6631 11.7778C5.18402 11.7778 3.17481 9.77243 3.17481 7.29027C3.17481 4.81161 5.18051 2.80275 7.6631 2.80275C10.1422 2.80275 12.1514 4.80811 12.1514 7.29027C12.1514 9.76892 10.1457 11.7778 7.6631 11.7778Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-10 relative text-center">
                <div className="relative text-center">
                  <h1 className="font-montserrat font-extrabold text-black leading-normal text-xl max-sm:text-base ">
                    Add a Friend via email address :
                  </h1>
                  <input
                    className="px-[10px] pe-12 py-[10px] text-center rounded-[48px] w-[70vw] 
                sm:w-[421px] font-montserrat font-medium
                leading-normal text-[15px]  placeholder-black mt-5"
                    required
                    placeholder={"Samm99@gmail.com"}
                    type={"email"}
                    name={"email"}
                    value={email}
                    onChange={(e) => handleInput(e)}

                  />
                  <div onClick={handleSearch} className="absolute max-sm:inset-y-[60px] md:inset-y-[65px] inset-y-[92px] max-sm:right-[40px] right-[25px] w-[20px] h-[20px] cursor-pointer max-md:inset-y-[62px]  ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                    >
                      <path
                        d="M18.0773 15.5186L14.5814 12.0232C14.4236 11.8654 14.2097 11.7778 13.9853 11.7778H13.4137C14.3815 10.5402 14.9566 8.98361 14.9566 7.29027C14.9566 3.26202 11.692 -0.00195312 7.6631 -0.00195312C3.63416 -0.00195312 0.369629 3.26202 0.369629 7.29027C0.369629 11.3185 3.63416 14.5825 7.6631 14.5825C9.35672 14.5825 10.9136 14.0075 12.1514 13.0399V13.6114C12.1514 13.8357 12.239 14.0496 12.3968 14.2074L15.8928 17.7027C16.2224 18.0323 16.7554 18.0323 17.0815 17.7027L18.0738 16.7106C18.4034 16.381 18.4034 15.8481 18.0773 15.5186ZM7.6631 11.7778C5.18402 11.7778 3.17481 9.77243 3.17481 7.29027C3.17481 4.81161 5.18051 2.80275 7.6631 2.80275C10.1422 2.80275 12.1514 4.80811 12.1514 7.29027C12.1514 9.76892 10.1457 11.7778 7.6631 11.7778Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen &&
          <div className='ModelView'>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={handleCloseModal}
              shouldCloseOnOverlayClick={true} // Enable closing the modal on overlay click
              contentLabel="Delete Account Modal"
              className="modal flex justify-center items-center min-h-screen"
            >
              <div ref={modalRef} className="flex justify-center items-center">
                <div className="modal-content bg-primary w-[500px] h-[434px] rounded-[20px] flex flex-col items-center pt-11">
                  <svg xmlns="http://www.w3.org/2000/svg" width="81" height="80" viewBox="0 0 81 80" fill="none">
                    <path d="M52.3711 35.8547C48.2876 38.5005 46.9004 44.6588 46.6801 47.3514C45.2249 58.8985 36.5898 56.7274 32.6747 61.3818C28.7596 66.0363 31.0334 72.7387 36.8358 75.6282C49.2889 81.3234 60.7749 80.0693 69.4706 69.8207C77.9715 58.9314 73.5206 45.8939 68.8828 40.6579C65.6995 37.0639 58.3409 31.9867 52.3711 35.8547Z" fill="#E59261" />
                    <path d="M18.2156 24.2024C18.8323 21.5015 21.1193 18.3929 22.7055 16.566C24.8203 14.1301 25.0518 11.6151 25.0005 9.84555C24.9491 8.07604 23.3163 4.59726 19.0791 3.66171C15.6894 2.91326 12.7535 4.53193 11.7014 5.62385C7.92457 9.12771 2.75589 18.2504 1.84537 24.6503C0.595642 33.4345 4.89166 41.9469 9.9426 47.4613C14.9935 52.9757 27.4842 58.0454 37.1961 54.414C46.908 50.7826 51.7089 44.2937 52.6355 43.1965C53.5621 42.0993 54.4447 39.4871 54.5188 37.7229C54.593 35.9587 52.8929 31.0884 47.8971 30.2472C43.9004 29.5742 41.8194 31.6345 40.7493 32.724C39.3228 34.1763 36.6161 37.5257 32.8487 38.5793C28.1395 39.8962 24.6217 39.3679 20.7575 35.5445C16.8933 31.7211 17.4448 27.5784 18.2156 24.2024Z" fill="#F3D146" />
                    <path d="M24.3102 7.91604C29.1501 4.7866 34.0944 7.65133 35.8827 8.98826C38.1718 10.6997 40.1344 15.345 38.5356 19.4885C36.9005 23.7263 32.6493 27.9641 26.2724 29.431C19.8955 30.8979 17.1158 25.6822 16.7888 22.0964C16.4618 18.5105 18.2604 11.8279 24.3102 7.91604Z" fill="#C5B5D3" />
                    <path d="M70.1629 7.56896C61.9472 0.947906 51.7301 0.154302 47.5131 0.959592C44.8837 1.46171 42.1412 3.26423 41.2205 6.44668C40.0696 10.4247 41.5612 12.6114 42.9177 13.5824C44.0029 14.3593 46.5588 14.6016 48.2054 14.7154C49.6222 14.8133 51.154 15.4674 52.1399 16.4129C53.1259 17.3583 53.4999 18.9194 53.7699 21.3507C53.9118 25.6374 57.0273 28.0946 59.7102 28.8892C61.9637 29.5567 63.2917 29.356 65.832 30.6282C68.3724 31.9003 69.3642 33.3945 70.2697 34.5537C71.1752 35.7129 73.7851 35.9775 75.58 35.3592C77.9133 34.5554 78.7503 31.74 78.8771 30.4328C79.3956 25.5703 78.3786 14.19 70.1629 7.56896Z" fill="#AFCBA2" />
                    <path d="M3.33151 52.898C5.43905 51.4168 7.54269 51.4617 9.08821 51.9489C10.6337 52.4362 12.5852 53.8979 13.756 55.7493C15.0087 57.7301 15.6255 60.109 18.1623 62.6426C20.6992 65.1763 22.7326 64.9093 24.684 66.4685C26.6354 68.0276 26.1632 70.3409 25.6753 71.6077C25.1875 72.8745 22.9433 74.8235 18.8453 74.8235C14.7474 74.8235 8.86185 72.6737 5.75518 69.4893C2.04747 65.6889 0.599511 61.4733 0.50194 59.4269C0.404368 57.3805 0.697082 54.7495 3.33151 52.898Z" fill="#95ABCC" />
                  </svg>

                  <h2 className="text-black text-center  pt-7 font-montserrat font-bold leading-6 text-[15px] leading-24">Sent a Friend Request</h2>

                  <div className="flex justify-center gap-4 pt-2">
                    <div>
                      <Image
                        src={user?.image ? user?.image : '/assets/images/mainProfileImg.png'}
                        width={89}
                        height={89}
                        className="!w-[89px] rounded-[13.198px] !h-[89px]"
                        alt={".."}
                        unoptimized
                        
                      />
                    </div>

                  </div>


                  <h2 className="text-black text-center  pt-7 font-montserrat font-bold leading-6 text-[15px] leading-24">{user?.email}</h2>

                  <div className="flex justify-center gap-4 mt-7">
                    <button onClick={() => handleFriendRequest(user?.id)} className="bg-black text-white text-[10px] font-bold px-8 py-2 rounded-[40px] border solid  border-black uppercase">
                      {user?.friendRequestStatus ? "Requested" : "Send"}
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </div >
        }
      </div >
    </>
  );
};

export default AddFriend;