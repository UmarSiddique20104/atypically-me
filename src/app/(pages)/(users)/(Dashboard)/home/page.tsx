import React, { useEffect } from "react";
import Home from "./Home";
import { Metadata } from "next";
import getAndDecryptCookie from "@/app/lib/auth";
export const metadata: Metadata = {
  title: "Home",
  description: "Generated by create next app",
};
const page = () => {
  
  return (
    <div>
      <Home />
    </div>
  );
};

export default page;
