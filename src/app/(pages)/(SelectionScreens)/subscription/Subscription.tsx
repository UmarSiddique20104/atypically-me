"use client";
import React, { useEffect, useState } from "react";
import SubcriptionIcon from "@/app/components/reuseables/Svgs/SubcriptionIcon";
import Button from "@/app/components/reuseables/Svgs/Button";
import Link from "next/link";
import "../../../globals.css";
import { getAllSubscriptions } from "@/app/components/utils/Helper";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import axios, { AxiosResponse } from "axios";
import getAndDecryptCookie from "@/app/lib/auth";

interface Condition {
  name: string;
  color: string;
}

interface TransformedSubscription {
  id: string;
  name: string;
  color: string;
  price: number;
  duration: string;
}

interface ApiResponse {
  data: {
    map(arg0: (data: any) => { id: any; name: any; color: any; price: any; duration: any; }): TransformedSubscription[];
    data: {
      attributes: PlaceAttributes;
    };
  };
  status: number;
}
interface PlaceAttributes {
  placeId: string;
  name: string;
  placeRatings?: {
    averageRating: number;
    numberOfRatings: number;
    percentages: number[];
    isRated: boolean;
    userRating: number;
  };
  types: string[];
  distance: number;
  images: string[];
  formattedAddress: string;
  openingHours?: {
    open_now: boolean;
    periods: { open: { time: string }; close: { time: string } }[];
  };
  website: string;
  url: string;
}
const Subscription = () => {
  const packages: Condition[] = [
    { name: "Anxiety Buster", color: "bg-orange-dark" },
    { name: "Mindset Makeover", color: "bg-yellow" },
    { name: "Emotional Resilience", color: "bg-cyanBlue-dark" },
  ];

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const token = getAndDecryptCookie('AccessToken');

  const toggleSelection = (itemName: string) => {
    setSelectedItem(itemName === selectedItem ? null : itemName);
  };

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        setIsLoading(true);
        const result = await getAllSubscriptions();
        setSubscriptions(result);
        setIsLoading(false);
      } catch (err) {
        console.error("===========err=========>", err);
        setIsLoading(false);
      }
    };

    getSubscriptions();
  }, []);

  const getAllSubscriptions = async (): Promise<TransformedSubscription[]> => {
    try {
      const res: AxiosResponse<ApiResponse> = await axios.get(API_ENDPOINTS.SUBSCRIPTIONS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        return res.data.data.map((data: any) => ({
          id: data.id,
          name: data.attributes.name,
          color: data.attributes.color,
          price: data.attributes.price,
          duration: data.attributes.duration,
        }));
      } else if (res.status === 204) {
        return [];
      } else {
        throw new Error('Failed to get Subscription Data');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || 'Failed to get Subscription Data');
      } else {
        throw new Error('Failed to get Subscription Data');
      }
    }
  };
  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="bg-primary min-h-svh max-[424px]:w-[100vw]  flex flex-col justify-center items-center relative">
        <div className="py-[80px] ">
          <div className="flex justify-center items-center max-[424px]:px-2 max-[424px]:w-[100vw] ">
            <SubcriptionIcon />
          </div>
          <div className="flex flex-col justify-center items-center max-[424px]:w-[100vw] pt-[32px]">
            {subscriptions.map((condition: any, index: number) => (
              <div
                key={index}
                className="p-2 "
                onClick={() => toggleSelection(condition.name)}
              >
                <div className="flex justify-center items-center">
                  <div
                    className={`cursor-pointer rounded-[10px] w-[90vw] md:w-[780px] h-[50vw] md:h-[164px] flex justify-center ${selectedItem === condition.name
                      ? "border-2 border-black"
                      : ""
                      }`}
                    style={{ backgroundColor: condition.color }}
                  >
                    <div className="condition-name pt-[9px] text-center px-5">
                      <p className="font-montserrat font-[700] leading-[1.3rem] pt-[27px] text-black text-[20px] text-center">
                        {condition.name}
                      </p>
                      <p className="font-montserrat font-[700] leading-[1.3rem] pt-[20px] text-black text-[20px] text-center">
                        {condition.duration}
                      </p>
                      <p className="font-montserrat font-[700] leading-[1.3rem] pt-[27px] text-black text-[20px] text-center">
                        ${condition.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center pt-[50px] max-[424px]:px-2 max-[424px]:w-[100vw]">
            <Link href={"/home"}>
              <Button>7 days FREE Trial</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
