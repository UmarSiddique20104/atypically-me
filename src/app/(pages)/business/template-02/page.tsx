'use client'
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
import BusinessLogo from "../components/businessLogo";
import Template2Tab from "../components/Template2Tab";
import Template2layout from "./Template2layout";

const Template2 = () => {
  useTokenRedirect();
  return (
    <>
    <Template2layout />
    </>
  );
};

export default Template2;

