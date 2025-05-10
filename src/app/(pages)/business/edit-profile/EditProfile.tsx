"use client";
import BussinessSidebar from "@/app/components/sidebar/BussinessSidebar";
import Profile from "../../../../../public/assets/images/noimgpic.jpeg";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import BussinessEditHeader from "@/app/components/sidebar/BusinessHeader/BussinesEditHeader";
import secureLocalStorage from "react-secure-storage";
import Dropdown from "@/app/components/reuseables/Dropdown";
import "../../../globals.css";
import { createHeaders, createRequestOptions, fetchApi } from "@/app/components/utils/Helper";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { showMessage } from "@/app/components/reuseables/Notification";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import getAndDecryptCookie, { Encrytion, storeToken } from "@/app/lib/auth";
import Button from "../../(Auth)/components/Button";
import { saveProfileData } from "@/app/redux/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/redux/store";
import { setEditMode } from "@/app/redux/editModeSlice";
import useTokenRedirect from "@/app/components/reuseables/useTokenRedirect";
interface Location {
  latitude: number,
  longitude: number,
  address: string | null;
  placeId: string | null;
}
function EditProfile() {
  const [editable, setEditable] = useState("");
  const [dealsList, setDealsList] = useState([])
  const [category, setCategory] = useState<any>([])
  const [businessName, setBusinessName] = useState<string | null>('')
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState<Location>({
    latitude: 0,
    longitude: 0,
    address: '',
    placeId: '',
  })
  const [sectedLocation, setsSectedLocation] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY ?? ""
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [inputValue, setInputValue] = useState<any>("");
  const [bio, setBio] = useState<string | null>("");
  const [selectedCategory, setSelectedCategory] = useState<any>("");
  const [addressLatitude, setAddressLatitude] = useState<number | null>(0);
  const [addressLongitude, setAddressLongitude] = useState<number | null>(0);
  const [addressPlaceId, setAddressPlaceId] = useState<string | null>("");
  const [savedcategory, setSavedcategory] = useState<string | null>("");
  const [image, setImage] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const token = getAndDecryptCookie('AccessToken');
  const userId = getAndDecryptCookie('Id');
  const router = useRouter();
  useTokenRedirect();
  const isEditing = useSelector((state: RootState) => state.editMode.isEditing);
  useEffect(() => {
    if (!token) {
      router.push("/welcome");
    }
  }, []);
  useEffect(() => {
    const edit: any = localStorage.getItem("edit");
    setEditable(edit);
  }, [editable]);

  const handleClickFunction = (selectedOption: any) => {
    setSelectedCategory(selectedOption)
  };

  const GetCategories = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GETCATEGORY}`;
    try {
      const result = await fetchApi(url, requestOptions);
      if (result?.success && result?.status === 200) {
        const categories = result.data.map((category: { category: string }) => category.category);
        setCategory(categories);
        setIsLoading(false);
      } else {
        showMessage(result?.message, "error");
        console.error('API Response Error:', result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);
    }
  };



  const EditProfile = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const formdata = new FormData();
    formdata.append("name", businessName ?? "");
    formdata.append("bio", bio ?? "");
    formdata.append("category", selectedCategory ? selectedCategory : savedcategory)
    formdata.append("location", inputValue ? inputValue : address.address);
    formdata.append("longitude", address.latitude ? String(address.latitude) : String(addressLatitude));
    formdata.append("latitude", address.longitude ? String(address.longitude) : String(addressLongitude));
    formdata.append("placeId", address.placeId || addressPlaceId || "");
    formdata.append("image", image);

    const requestOptions = createRequestOptions("POST", headers, formdata);
    const url = API_ENDPOINTS.EDITPROFILE;

    try {
      const result = await fetchApi(url, requestOptions);
      handleApiResponse(result);
    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);
    }

  };

  const dispatch = useDispatch()

  const handleApiResponse = (result: any) => {
    if (result?.success && result?.status === 200) {
      setIsLoading(false);
      dispatch(saveProfileData(result?.data));
      dispatch(setEditMode(false));
      getProfileData()
      showMessage(result?.message)
    } else {
      showMessage(result?.message, "error");
      console.error('API Response Error:', result);
      setIsLoading(false);
    }
  };

  const GetCategory = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GETCATEGORY}`;
    try {
      const result = await fetchApi(url, requestOptions);
      if (result?.success && result?.status === 200) {
        const categories = result.data.map((category: { category: string }) => category.category);
        setCategory(categories);
        setIsLoading(false);
      } else {
        showMessage(result?.message, "error");
        console.error('API Response Error:', result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);
    }
  };

  const getProfileData = async () => {
    setIsLoading(true);
    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GETSINGLEPROFILE}/${userId}`;

    try {
      const result = await fetchApi(url, requestOptions);
      if (result?.success && result?.status === 200) {
        // setName(result?.data?.name);
        // setBannerImage(result?.data?.mainBannerImage);


        dispatch(saveProfileData(result?.data));


        setSavedcategory(result?.data?.category)
        setAddressLatitude(Number(result?.data?.latitude))
        setAddressLongitude(Number(result?.data?.longitude))
        setAddressPlaceId(result?.data?.placeId ?? "")
        let imageUrl;

        if (result?.data?.image?.startsWith("http://")) {
          imageUrl = result.data.image.replace("http://", "https://");
        } else {
          imageUrl = result?.data?.image;
        }

        setPreviewImage(imageUrl ?? "");
        setAddress((prevAddress: Location) => ({
          ...prevAddress,
          address: inputValue || prevAddress.address || '', // provide a default value for address
        }));
        setInputValue(result?.data?.location)
        setBusinessName(result?.data?.name)
        setBio(result?.data?.bio)
        setIsLoading(false);
      } else {
        // showMessage(result?.message, "error");
        console.error('API Response Error:', result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('GetDeals error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetCategories();
    GetCategory()
    getProfileData()
  }, []);




  const handlePlaceSelect = () => {

    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place && place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),

        };
        const BusinessAddress = {
          latitude: location.lat,
          longitude: location.lng,
          address: place.name,
          placeId: place.place_id
        }
        setAddress(BusinessAddress)
        setSelectedLocation(location);
        setInputValue(place?.formatted_address);
        setsSectedLocation(false)

      }
    }
  };

  const onLoad = (autocomplete: any) => {
    setAutocomplete(autocomplete);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const [mapLoad, setMapLoad] = useState<boolean>(false)
  useEffect(() => {
    setMapLoad(true)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {

        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };


  return (
    <>
      {isLoading && <div className="loaderScreen">
        <Loader />
      </div>}

      <div className="flex min-h-svh">
        <div className="flex flex-col ps-[29px] pe-[10px] max-sm:px-[10px] max-sm:pt-[20px] w-full bg-primary">
          <BussinessEditHeader
            padding={false}
            mainTitle="Profile"
            colour="bg-[#f5f5f5]"
            addbtn="max-sm:hidden"
            linkclass="hidden"
          />
          <div className="flex flex-col justify-center items-center max-sm:px-2 ps-20 mt-24 max-sm:mt-40 py-4 w-full  mb-10">
            <div className='rounded-[50%] cursor-pointer bg-[#F5F5F5]' onClick={() => document.getElementById('profile-picture-input')?.click()}>
              {previewImage ? (
                <div>
                  <Image
                    src={previewImage}
                    width={225}
                    height={225}
                    className="w-[225.688px] rounded-[13.198px] h-[225.688px] cursor-pointer"
                    alt={".."}
                    unoptimized

                  />
                </div>

              ) : (
                <div className='text-center'>
                  <Image
                    src={Profile}
                    className="w-[225.688px] rounded-[13.198px] h-[225.688px] cursor-pointer"
                    alt={".."}
                    unoptimized

                  />
                </div>
              )}
              <input id="profile-picture-input"
                type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            <div className="py-4">
              <input
                autoComplete="off"
                className="outline-none my-2 text-center bg-primary w-full"
                type="text"
                placeholder="Business Name"
                value={businessName || ""}
                onChange={(e) => setBusinessName(e.target.value)}

              />
            </div>

            <>
              <div className="w-full flex flex-col py-2 border-dashed border-b-2 border-[#000]">
                <p className="font-montserrat font-extrabold text-[20.245px] leading-normal">
                  Bio :
                </p>
                <input
                  type="text"
                  className=" outline-none py-3 my-2  bg-primary"
                  value={bio || ""}
                  onChange={(e) => setBio(e.target.value)}


                />
              </div>
              <div className="w-full flex flex-col py-2 border-dashed border-b-2 pt-2 border-[#000] my-[23px]">
                <p className="font-montserrat font-extrabold text-[20.245px] leading-normal">
                  Category :
                </p>
                <Dropdown
                  label=""
                  options={category}
                  active=""
                  handleClick={handleClickFunction}
                  twClass="#ffffff "
                  color="#ffffff"

                  width="!w-full mb-2 px-5 "
                  category={savedcategory ?? ""}
                />



              </div>
              <div className="w-full flex flex-col py-2 border-dashed border-b-2 border-[#000] mb-5">
                <p className="font-montserrat font-extrabold text-[20.245px] leading-normal">
                  Location
                </p>

                <div className="relative sm:pt-[30px] pt-[30px] custom-autocomplete">
                  {mapLoad && (
                    <LoadScript
                      googleMapsApiKey={apiKey}
                      libraries={["places", "geometry", "visualization"]}
                    >
                      <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceSelect}>
                        <input
                          autoComplete="off"
                          className="outline-none my-2 bg-primary w-full"
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}


                        />
                      </Autocomplete>
                    </LoadScript>
                  )}

                </div>
              </div>
            </>


            <div onClick={() => EditProfile()} className="mt-4">
              <Button>Save</Button>
            </div>


          </div>
        </div>
      </div >
    </>
  );
}

export default EditProfile;
