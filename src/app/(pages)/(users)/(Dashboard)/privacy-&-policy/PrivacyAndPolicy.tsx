"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import line2 from "../../../../../../public/assets/images/line2.png";
import Button from "@/app/components/reuseables/Svgs/Button";
import "../../../../globals.css";
import {
  createHeaders,
  createRequestOptions,
  fetchApi,
} from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { showMessage } from "@/app/components/reuseables/Notification";
import getAndDecryptCookie from "@/app/lib/auth";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";

const PrivacyAndPolicy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = getAndDecryptCookie("AccessToken");
  const [data, setData] = useState<any>();
  useEffect(() => {
    const getPrivacyPolicy = async () => {
      setIsLoading(true);
      const headers = createHeaders(token ?? "");
      const requestOptions = createRequestOptions("GET", headers);
      const url = `${API_ENDPOINTS.GET_PRIVACYPOLICY}`;
      try {
        const result = await fetchApi(url, requestOptions);

        if (result?.data) {
          setData(result?.data?.attributes?.details);
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
    getPrivacyPolicy();
  }, []);
  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="flex min-h-screen bg-primary">
        <div className="flex flex-col w-full">
          <MainHeader
            title="Privacy & Policy"
            subtitle=""
            goto="/home"
            bg="yellow"
            font="24px"
            paddding={true}
          />
          <div className="ml-28 md:ml-ml-28 max-sm:ml-[1.3rem]   pr-4 mt-5">
            <div className="pt-8 max-lg:px-2 px-16">
              <p
                className="font-montserrat font-normal leading-[30px] text-[15px] capitalize text-justify"
                style={{ wordSpacing: "1px" }}
                dangerouslySetInnerHTML={{ __html: data }}
              >
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel facilisis volutpat est velit egestas dui id ornare. Viverra aliquet eget sit amet tellus cras adipiscing enim. Scelerisque viverra mauris in aliquam sem. Tincidunt eget nullam non nisi est sit amet facilisis magna. Enim praesent elementum facilisis leo vel. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus viverra. Amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus. Dolor sit amet consectetur adipiscing elit duis tristique sollicitudin. Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu. Gravida cum sociis natoque penatibus et magnis dis. Feugiat nibh sed pulvinar proin gravida. Nisl tincidunt eget nullam non nisi est sit amet.<br />Ornare aenean euismod elementum nisi. Tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra. Nulla facilisi morbi tempus iaculis urna id. Dis parturient montes nascetur ridiculus. Bibendum arcu vitae elementum curabitur vitae nunc sed velit. Volutpat est velit egestas dui id ornare. Sit amet dictum sit amet justo. Integer enim neque volutpat ac tincidunt vitae semper quis lectus. Dignissim cras tincidunt lobortis feugiat. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit. Risus ultricies tristique nulla aliquet enim tortor. Nec feugiat nisl pretium fusce id velit. Nibh mauris cursus mattis molestie a iaculis. Pellentesque habitant morbi tristique senectus. Sit amet tellus cras adipiscing. Turpis egestas integer eget aliquet nibh. */}
              </p>
            </div>
            <div className="pt-20 text-center py-4">
              <Link href={"/support"}>
                <Button className="text-xl px-[55px] py-[9px]">Support</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyAndPolicy;
