import React, { Suspense } from 'react'
import Chats from './Chats'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Messages",
    description: "Generated by create next app",
};
const page = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Chats />
            </Suspense>
        </>
    )
}

export default page
