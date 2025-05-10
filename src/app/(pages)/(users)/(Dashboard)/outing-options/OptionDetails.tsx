"use client";
import React, { useEffect, useRef, useState } from "react";
import OptionLeft from "./OptionLeft";
import OptionCenter from "./OptionCenter";
import { User } from "@/types/types";
import {
  getGooglePlacesResult,
  getUserGeolocation,
} from "@/app/components/utils/Helper";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";

const OptionDetails: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef: any = useRef(null);
  const [noContent, setNoContent] = useState(false);
  const [locationByDistance, setLocationByDistance] = useState([]);
  const [locationByRelevance, setLocationByRelevance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const paramsName = new URLSearchParams(window.location.search).get("name");
        const data = paramsName ? paramsName.replace(/<br\s*\/?>/gi, " ") : "";

        setIsLoading(true);
        const loc = await getUserGeolocation();
        console.log('User location:', loc);

        const resultDistance = await getGooglePlacesResult("distance", data, loc.latitude, loc.longitude);
        if (resultDistance.length > 0) {
          setLocationByDistance(resultDistance);
        }

        const resultRelevance = await getGooglePlacesResult("relevance", data, loc.latitude, loc.longitude);
        if (resultRelevance.length > 0) {
          setLocationByRelevance(resultRelevance);
        }

        if (resultDistance.length === 0 && resultRelevance.length === 0) {
          setNoContent(true);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching place data:", error);
      }
    };

    fetchPlaces();
  }, []); // Empty dependency array ensures this runs only on mount


  return (
    <div className="h-full pt-2">
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      {/* {locationByDistance.length || locationByDistance?.length ? ( */}
      <div className="flex gap-1 h-full">
        <div className="hidden lg:block sm:w-[520px] h-full bg-neutral-100 border border-dashed border-r-black">
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className="mt-[16px] pt-3 ">
              <OptionLeft
                users={locationByDistance}
                relevenceUsers={locationByRelevance}
                selectUser={(user) => {
                  setSelectedUser(user);
                  setIsDrawerOpen(false);
                }}
              />
            </div>
          </div>
        </div>


        {/* <div className="border-t-4 border-black border-dotted h-[115vh] "></div> */}
        <div className="flex-1 flex flex-col bg-neutral-100 h-full">
          <div className="h-full overflow-y-auto">
            {selectedUser && <OptionCenter selectedUser={selectedUser} />}
          </div>
        </div>

        <button
          className="lg:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full"
          onClick={() => setIsDrawerOpen(true)}
        >
          <svg
            className="relative cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="19"
            viewBox="0 0 23 19"
            fill="none"
          >
            <rect
              x="0.400391"
              width="22.2"
              height="3.7"
              rx="1.85"
              fill="white"
            />
            <rect
              x="0.400391"
              y="7.3999"
              width="22.2"
              height="3.7"
              rx="1.85"
              fill="white"
            />
            <rect
              x="0.400391"
              y="14.8"
              width="22.2"
              height="3.7"
              rx="1.85"
              fill="white"
            />
          </svg>
        </button>
        {isDrawerOpen && (
          <div className="lg:hidden fixed inset-0 bg-[gray-800] bg-opacity-75 z-50">
            <div
              ref={dropdownRef}
              className="absolute top-0 left-0 w-[80%] h-full bg-[#F5F5F5] p-4"
            >
              <button
                className="mb-4 font-montserrat font-semibold text-lg leading-normal"
                onClick={() => setIsDrawerOpen(false)}
              >
                X
              </button>
              <OptionLeft
                users={locationByDistance}
                relevenceUsers={locationByRelevance}
                selectUser={(user) => {
                  setSelectedUser(user);
                  setIsDrawerOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* // ) : (
      //   <div className="flex justify-center items-center mt-5">
      //     <p className="text-xl text-black font-bold">No Data Found</p>
      //   </div>
      // )} */}
    </div>
  );
};

export default OptionDetails;