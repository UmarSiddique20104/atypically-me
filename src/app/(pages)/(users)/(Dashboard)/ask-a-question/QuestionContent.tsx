'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useRef, useState, useEffect } from 'react'
import '../../../../globals.css'
import moment from 'moment'
import NoProfile from '../../../../../../public/assets/images/noProfile.png'
import { useSearchParams } from 'next/navigation'

interface DiscussionItem {
    attributes: {
        userId: {
            image: string;
            nickName: string;
        };
        text: string;
        createdAt: string;
    };
    type: string
    id: string
}

const QuestionContent: React.FC<{ discussions: DiscussionItem[], placeDetails: any }> = ({ discussions, placeDetails }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [startX, setStartX] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const itemsPerRow = 3;
    const totalRows = Math.ceil(discussions?.length / itemsPerRow);

    const handleDotClick = (index: number) => {
        setActiveIndex(index);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!startX) return;

        const touchEndX = e.touches[0].clientX;
        const touchDiff = startX - touchEndX;

        if (touchDiff > 50) {
            // Swipe left
            setActiveIndex((prev) => Math.min(prev + 1, totalRows - 1));
            setStartX(null);
        } else if (touchDiff < -50) {
            // Swipe right
            setActiveIndex((prev) => Math.max(prev - 1, 0));
            setStartX(null);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartX(e.clientX);
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || startX === null) return;

        const endX = e.clientX;
        const diff = startX - endX;

        if (diff > 50) {
            // Drag left
            setActiveIndex((prev) => Math.min(prev + 1, totalRows - 1));
            setStartX(null);
            setIsDragging(false);
        } else if (diff < -50) {
            // Drag right
            setActiveIndex((prev) => Math.max(prev - 1, 0));
            setStartX(null);
            setIsDragging(false);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setStartX(null);
    };

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${activeIndex * 100}%)`;
        }
    }, [activeIndex]);


console.log('discussions',discussions)
    const searchParams = useSearchParams();
    const OutingName = searchParams.get('name');
    return (
        <>
            {discussions?.length ?


                <div
                    className="relative overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div ref={sliderRef} className="flex transition-transform duration-300 ease-in-out">
                        {discussions.map((item: DiscussionItem, i: number) => (
                            <div
                                key={i}
                                className="flex border border-solid border-black p-6 rounded-[10px] w-[91%] shrink-0 mx-4 lg:w-[calc(33.33%-2rem)] md:w-[calc(50%-2rem)] sm:w-full"
                            >
                                <div className="mr-2">
                                    <div className='pt-7'>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                width={29}
                                                height={29}
                                                src={item?.attributes?.userId?.image ? item?.attributes?.userId?.image : NoProfile}
                                                alt="profileAvatar"
                                                className='rounded-[10px]'
                                                unoptimized
                                            />
                                            <p className="font-montserrat text-[15px] font-bold leading-normal text-black">
                                                {item?.attributes?.userId?.nickName}
                                            </p>
                                            <div className="font-montserrat text-[10px] font-normal leading-normal text-black">
                                                {moment(item?.attributes?.createdAt).fromNow()}
                                            </div>
                                        </div>
                                        <p className="pt-1 font-montserrat text-[15px] font-bold leading-normal text-black">
                                            {item?.attributes?.text}
                                        </p>
                                    </div>
                                    <Link href={`/userchat?name=${OutingName}&type=${item?.type}&id=${item?.id}&Questionerimage=${item?.attributes?.userId?.image}?questionerName=${placeDetails?.name}`}>
                                        <div className="pt-7 font-montserrat text-[10px] font-bold leading-normal text-[#2997FD]">
                                            View in Community...
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-5">
                        {Array.from({ length: totalRows }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-full mx-1 cursor-pointer ${i === activeIndex ? 'bg-black' : 'bg-white border-black border'
                                    }`}
                                onClick={() => handleDotClick(i)}
                            />
                        ))}
                    </div>
                </div>
                :
                <div className="text-center font-medium pt-10">No questions found</div>


            }

        </>
    )
}

export default QuestionContent;
