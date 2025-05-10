'use client'
import { useEffect, useState } from "react";
import BusinessLogo from "../components/businessLogo";
import Template2Tab from "../components/Template2Tab";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
function Template2layout() {

  const [locmargin, setLocMargin] = useState('')
  useTokenRedirect();
  useEffect(() => {
    const locationUrl = window.location.pathname
    if (!locationUrl.includes('/business/select-template')) {
      setLocMargin('max-sm:mt-24')
    } else {
      setLocMargin('')
    }
  }, [])
  return (
    <div className={`min-h-svh  w-[100%] ${locmargin}`}>
      <BusinessLogo />

      <div className="container mx-auto pt-3 ">
        <Template2Tab />
      </div>
    </div>
  )
}

export default Template2layout
