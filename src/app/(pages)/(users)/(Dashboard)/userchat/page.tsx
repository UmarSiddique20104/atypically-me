import React, { Suspense } from "react";
import "../../../../globals.css";
import MainChat from "./MainChat";
function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <MainChat />
      </Suspense>

    </>
  );
}

export default page;