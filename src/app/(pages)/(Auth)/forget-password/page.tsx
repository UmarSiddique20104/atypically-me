import React from 'react'
import ForgetPassword from './ForgetPassword'
import  "../../../globals.css"
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Forget Password",
    description: "Generated by create next app",
};
const page = () => {
    return (
        <div>
            <ForgetPassword />
        </div>
    )
}

export default page
