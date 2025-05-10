import Image from "next/image";
import React, { useEffect, useState } from "react";
import { likeMessage } from "../reuseable/ApiCall";
 
export const LikeButton = ({ data }: any) => {
  const { id, user, likes, message } = data;

  const [TotalLikes, setTotalLikes] = useState<any>(message?.likes);
  const [isLikedPreviously, setisLikedPreviously] = useState<any>(
    message?.isLiked
  );
  const [likesData, setLikeData] = useState<any>([]);
  const handleLikeClick = async () => {
    const data = await likeMessage(id!, user ? "message" : "post");
    if (!data?.data?.attributes || data?.data?.attributes === undefined) {
      DislikedLikedComment();
      setisLikedPreviously(false);
    } else {
      setisLikedPreviously(true);
      setLikeData(data);
      LikedComment();
    }
  };

  const LikedComment = () => {
    if (message?.isLiked) {
      setTotalLikes(likes);
    } else {
      setTotalLikes(likes + 1);
    }
  };
  const DislikedLikedComment = () => {
    if (message?.isLiked) {
      setTotalLikes(likes - 1);
    } else {
      setTotalLikes(likes);
    }
  };
  return (
    <>
      {isLikedPreviously ? (
        <>
          <span className="flex gap-x-1">
            <Image
              onClick={handleLikeClick}
              width={24}
              height={24}
              src={"/assets/images/likeBlack.png"}
              alt="likeIcon"
              className="object-fill cursor-pointer"
              unoptimized
            />
                <span>{TotalLikes}</span>
          </span>
          
        </>
      ) : (
        <>
          <span className="flex gap-x-1">
            <Image
              onClick={handleLikeClick}
              width={20}
              height={20}
              src={"/assets/images/likeIcon.png"}
              alt="likeIcon"
              className="object-contain cursor-pointer"
              unoptimized
            />
                <span>{TotalLikes}</span>
                </span>
        </>
      )}
    </>
  );
};