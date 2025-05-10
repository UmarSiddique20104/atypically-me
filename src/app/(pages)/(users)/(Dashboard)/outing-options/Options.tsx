"use client";
import { useEffect, useState } from "react";
import MainHeader from "@/app/components/sidebar/MainHeader/MainHeader";
import OptionDetails from "./OptionDetails";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";

function Options() {
  const [option, setOption] = useState<string | null>(null);
  useTokenRedirect();
  useEffect(() => {
    const paramsName = new URLSearchParams(window.location.search).get(
      "name"
    );
    const data = paramsName ? paramsName.replace(/<br\s*\/?>/gi, " ") : "";
    setOption(data)
  }, []);


  return (
    <div className="flex flex-col w-full h-svh bg-primary min-h-screen">
      <div className="fixed z-40 md:top-0 top-0 w-full">
        <MainHeader
          title={option ?? ""}
          subtitle=""
          goto="/home"
          bg="purple"
          font="24px"
          paddding={true}
        />
      </div>
      <div className="md:ml-24 pt-52 h-svh overflow-hidden">
        <OptionDetails />
      </div>
    </div>
  );
}

export default Options;