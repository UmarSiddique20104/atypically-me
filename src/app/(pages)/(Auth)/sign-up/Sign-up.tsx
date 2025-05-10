"use client";
import secureLocalStorage from "react-secure-storage";
import BussinessSignup from "./BussinessSignup";
import UserSignup from "./UserSignup";
import getAndDecryptCookie from "@/app/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const role = getAndDecryptCookie("Role");
  const navigateRole = getAndDecryptCookie("role");

  const token = getAndDecryptCookie("AccessToken");
  const navigate = useRouter();
  useEffect(() => {
    if (role === "user" && token) {
      navigate.push("/feeling-today");
    } else if (role === "business" && token) {
      navigate.push("/business/dashboard");
    }
  }, []);
  return <div>{navigateRole === "user" ? <UserSignup /> : <BussinessSignup />}</div>;
};

export default Signup;
