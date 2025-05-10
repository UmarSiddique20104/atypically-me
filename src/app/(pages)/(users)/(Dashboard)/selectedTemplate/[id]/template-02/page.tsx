import BusinessLogo from "../components/businessLogo";
import Image from "next/image";
import ImageIcon from "@/assets/images/getImageIcon.png";
import Template2Tab from "../components/Template2Tab";
import dummyImg from "@/assets/images/temp1logo.png"


const Template2 = (data:any) => {
  const image = data?.data?.userProfile?.image
  return (
    <div className="min-h-svh sm:ms-24 px-2 max-sm:pt-24  ">
      <BusinessLogo  image={image ? image: dummyImg}  title={data?.data?.userProfile?.name}/>

      <div className="xl:container   mx-auto pt-3 ">
        <Template2Tab data={data} />
      </div>
    </div>
  );
};

export default Template2;