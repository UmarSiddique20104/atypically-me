import React from 'react'
import Suggesion from './Suggesion'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Business Suggesions",
    description: "Generated by create next app",
};

const page = () => {

    return (
        <div>
            <Suggesion />
        </div>
    )
}

export default page
