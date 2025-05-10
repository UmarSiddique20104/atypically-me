"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  _id?: number;
  attributes?: {
    name: string;
  };
  participants?: {
    userId: {
      nickName?: string;
      image?: string;
    };
  };
  isUser?: boolean;
}

interface UserListProps {
  users: User[];
  selectUser: (user: User) => void;
  directUsers?: User[];
  user:any
}

const UserList: React.FC<UserListProps> = ({
  users,
  user,
  selectUser,
  directUsers,
}) => {
  
  const [isChannelsOpen, setIsChannelsOpen] = useState(true);
  const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState(true);
  const [activeChannel, setActiveChannel] = useState<number | null>(user);
  const [activeDirectUser, setActiveDirectUser] = useState<number | null>(null);
// console.log("First ",user?.id,user?._id)
  const toggleChannels = () => {
    setIsChannelsOpen(!isChannelsOpen);
  };

  // console.log("UserID",directUsers)
  const toggleDirectMessages = () => {
    setIsDirectMessagesOpen(!isDirectMessagesOpen);
  };
  const searchParams = useSearchParams();
  const IdUser = searchParams.get("userId");
  useEffect(() => {
    //@ts-ignore
    setActiveDirectUser(IdUser);
  }, []);

  const handleDirectUserSelect = (user: User) => {
    // console.log("Function Call", user);
    setActiveDirectUser(user._id ? user._id : user.id);
    setActiveChannel(null);
    selectUser(user);
  };

  // console.log("Direct User==>", activeDirectUser);

  return (
    <div className="h-full max-sm:overflow-y-auto no-scrollbar">
      <div className="mt-5 max-sm:mt-0">
        <div
          className="flex justify-between items-center cursor-pointer px-6 text-2xl md:pr-[4rem]  pr-4"
          onClick={toggleChannels}
        >
          <h1 className="font-montserrat font-extrabold leading-normal ">
            Channels
          </h1>
          {isChannelsOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="9"
              viewBox="0 0 11 9"
              fill="none"
            >
              <path
                d="M6.08112 0.50029L10.7576 6.29313C11.0808 6.69351 11.0808 7.34095 10.7576 7.73708L9.98046 8.69971C9.65724 9.1001 9.13457 9.1001 8.81479 8.69971L5.5 4.59361L2.18521 8.69971C1.86199 9.1001 1.33932 9.1001 1.01954 8.69971L0.242418 7.73708C-0.0808078 7.33669 -0.0808079 6.68926 0.242418 6.29313L4.91888 0.50029C5.23523 0.0999027 5.75789 0.0999026 6.08112 0.50029Z"
                fill="black"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="9"
              viewBox="0 0 11 9"
              fill="none"
            >
              <path
                d="M4.91888 8.49971L0.242419 2.70687C-0.0808069 2.30649 -0.0808068 1.65905 0.242419 1.26292L1.01954 0.300291C1.34276 -0.100097 1.86543 -0.100096 2.18521 0.300291L5.5 4.40639L8.81479 0.300292C9.13801 -0.100095 9.66068 -0.100095 9.98046 0.300292L10.7576 1.26293C11.0808 1.66331 11.0808 2.31075 10.7576 2.70688L6.08112 8.49971C5.76477 8.9001 5.24211 8.9001 4.91888 8.49971Z"
                fill="black"
              />
            </svg>
          )}
        </div>
        <div
          className={` ${
            isChannelsOpen ? `` : `h-[10svh]`
          } border-t-4 border-black border-dotted mt-5 pt-3 overflow-y-auto overflow-x-hidden no-scrollbar`}
        >
          {isChannelsOpen &&
            users?.map((channel) => (
              <div
                key={channel.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 px-16 md:pr-[4rem] pr-4 ${
                  user?.id === channel.id ? "text-[#EC7E3D]" : ""
                }`}
                onClick={() => handleDirectUserSelect(channel)}
              >
                <span>{channel?.attributes?.name}</span>
              </div>
            ))}
        </div>
        <div className={isChannelsOpen ? `pt-14` : "pt-10"}>
          <div
            className="flex justify-between items-center  max-lg:px-2 px-6 text-2xl md:pr-[4rem]  pr-4 cursor-pointer "
            onClick={toggleDirectMessages}
          >
            <h1 className="font-montserrat  font-extrabold leading-normal">
              Direct messages
            </h1>
            {isDirectMessagesOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="9"
                viewBox="0 0 11 9"
                fill="none"
              >
                <path
                  d="M6.08112 0.50029L10.7576 6.29313C11.0808 6.69351 11.0808 7.34095 10.7576 7.73708L9.98046 8.69971C9.65724 9.1001 9.13457 9.1001 8.81479 8.69971L5.5 4.59361L2.18521 8.69971C1.86199 9.1001 1.33932 9.1001 1.01954 8.69971L0.242418 7.73708C-0.0808078 7.33669 -0.0808079 6.68926 0.242418 6.29313L4.91888 0.50029C5.23523 0.0999027 5.75789 0.0999026 6.08112 0.50029Z"
                  fill="black"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="9"
                viewBox="0 0 11 9"
                fill="none"
              >
                <path
                  d="M4.91888 8.49971L0.242419 2.70687C-0.0808069 2.30649 -0.0808068 1.65905 0.242419 1.26292L1.01954 0.300291C1.34276 -0.100097 1.86543 -0.100096 2.18521 0.300291L5.5 4.40639L8.81479 0.300292C9.13801 -0.100095 9.66068 -0.100095 9.98046 0.300292L10.7576 1.26293C11.0808 1.66331 11.0808 2.31075 10.7576 2.70688L6.08112 8.49971C5.76477 8.9001 5.24211 8.9001 4.91888 8.49971Z"
                  fill="black"
                />
              </svg>
            )}
          </div>
          <div
            className={` ${
              isDirectMessagesOpen ? `h-[40svh]` : `h-[10svh]`
            } border-t-4 border-black border-dotted mt-5 overflow-y-auto overflow-x-hidden no-scrollbar`}
          >
            {isDirectMessagesOpen &&
              directUsers?.map((user1) => (
                <div
                  key={user1._id}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 px-6 md:pr-[4rem] pr-4 ${
                    user?._id === user1._id ? "text-[#EC7E3D]" : ""
                  }`}
                  onClick={() => (
                    handleDirectUserSelect(user1),
                    selectUser({ isUser: true, ...user1 })
                  )}
                >
                  <Image
                    className="w-12 h-12 rounded-full mr-4"
                    width={12}
                    height={12}
                    src={user1?.participants?.userId?.image!}
                    alt="profileImg"
                    unoptimized
                  />
                  <span>{user1?.participants?.userId?.nickName}</span>
                </div>
              ))}
          </div>
        </div>

        <div className={isChannelsOpen ? `pb-14 md:h-[18svh]` : " h-[10svh]"}>
          <Link href={"/add-a-friend"}>
            <div className="border-t-4 border-black border-dotted mt-5"></div>
            <h1 className="font-montserrat cursor-pointer font-extrabold leading-normal max-lg:px-2 px-6 text-2xl md:pr-[4rem]  pr-4 pt-8">
              +Add a Friend
            </h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserList;
