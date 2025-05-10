import Image from "next/image";
import React, { useState } from "react";
import type { User } from "../../(users)/(Dashboard)/community/Community";
import { likeMessage, shareMessage } from "../reuseable/ApiCall";

type data = {
  id: string | undefined;
  user: boolean | undefined;
  shares: number | undefined;
  channelId: number | undefined;
};

export const ShareButton = ({
  channels,
  data,
}: {
  channels: User[];
  data: data;
}) => {
  const { id, user, shares } = data;
  const [openShareDropdown, setOpenShareDropdown] = useState(false);
  const [shareState, setShareState] = useState(shares || 0);

  return (
    <>
      {openShareDropdown && (
        <div
          className="absolute z-10 bg-white rounded-lg w-[93%] h-24 mt-1 top-5 left-[30px] max-[500px]:left-[10px] overflow-y-auto no-scrollbar "
        >
          {channels?.map((channel) => (
            <div
              key={channel.id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-black text-base flex flex-col gap-y-1"
              onClick={async () => {
                await shareMessage({ postId: id, channelId: channel.id });
                setOpenShareDropdown(false);
                setShareState((prevShares) => prevShares + 1);
              }}
            >
              {channel?.attributes?.name}
            </div>
          ))}
        </div>
      )}
      {!user ? (
        <span className="cursor-pointer flex gap-x-1">
          <Image
            width={20}
            height={20}
            src={"/assets/images/shareIcon.png"}
            alt="shareIcon"
            className="h-5"
            onClick={() => setOpenShareDropdown(!openShareDropdown)}
            unoptimized
          />{" "}
          <span>{shareState}</span>{" "}
        </span>
      ) : (
        ""
      )}
    </>
  );
};
