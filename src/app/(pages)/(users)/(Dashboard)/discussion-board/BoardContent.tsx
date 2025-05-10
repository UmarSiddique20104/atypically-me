import Image from "next/image";
import Link from "next/link";
import React from "react";
import "../../../../globals.css";
import moment from "moment";
import { useSearchParams } from "next/navigation";

interface DiscussionItem {
  attributes: {
    userId: {
      image: string;
      nickName: string;
    };
    text: string;
    createdAt: string;
  };
}

const BoardContent: React.FC<{
  items: DiscussionItem[];
  data: any;
  placeDetails: any;
}> = ({ items, data, placeDetails }) => {
  const searchParams = useSearchParams();
  const OutingName = searchParams.get('name');

  return (
    <>
      {items?.length ?
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-2 ms-10 max-sm:ms-[1.2rem] mb-10">

          {items.slice(0, 3).map((item: any, i: any) => {
            return <div
              key={i}
              className="border border-solid border-black p-6  rounded-[10px] !mt-0"
            >
              <div className="flex items-center gap-2">
                <Image
                  width={50}
                  height={70}
                  className="!h-[50px] rounded-[10px]"
                  src={item?.attributes?.userId?.image}
                  alt="profileAvatar"
                  unoptimized
                />
                <p className="font-montserrat text-2xl font-semibold leading-normal text-black">
                  {item?.attributes?.userId?.nickName}
                </p>
                <div className="font-montserrat text-[10px] font-normal leading-normal text-black">
                  {moment(item?.attributes?.createdAt).fromNow()}
                </div>
              </div>
              <p className="pt-4 font-montserrat text-[15px] font-normal leading-normal text-black">
                {item?.attributes?.text}
              </p>

              <Link href={`/userchat?name=${OutingName}&type=${item?.type}&id=${item?.id}&Questionerimage=${item?.attributes?.userId?.image}?questionerName=${placeDetails?.name}`}>
                <div className="pt-4 font-montserrat text-[15px] font-normal leading-normal text-[#2997FD]">
                  View in Community...
                </div>
              </Link>
            </div>

          })
          }
        </div>
        :
        <div className="text-center font-medium pt-10">No discussion found</div>
      }
    </>

  );
};

export default BoardContent;
