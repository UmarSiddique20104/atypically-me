"use client";
import TextInput from "../components/InputFields";
import Image from "next/image";
import React, { useState } from "react";
import GoogleIcon from "../../../components/reuseables/Svgs/GoogleIcon";
import FacebookIcon from "../../../../assets/svgs/auth/FacebookIcon.svg";
import Button from "../components/Button";
import Link from "next/link";
import CustomHeading from "@/app/components/reuseables/CustomHeading";
import { useFormik } from "formik";
import { SignupSchema } from "@/app/schema/signup";
import FacobookIcon from "../../../../assets/svgs/auth/FacebookIcon.svg";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { useRouter, useSearchParams } from "next/navigation";
import { showMessage } from "@/app/components/reuseables/Notification";
import { saveSocialLoginData } from "@/app/redux/socialLogin";
import { signInWithPopup } from "firebase/auth";
import {
  auth,
  provider,
  facebookProvider,
} from "@/app/components/common/firebase/common";
import { useDispatch, useSelector } from "react-redux";
import getAndDecryptCookie, { clearAllCookies, Encrytion, storeToken } from "@/app/lib/auth";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import { useGoogleLogin } from "@react-oauth/google";
import { initializeSocket } from "@/app/redux/users/userChat";

const Signup = () => {
  const dispatch = useDispatch();
  const navigateRole = getAndDecryptCookie("role");
  const role = getAndDecryptCookie("Role");

  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedGenderState, setSelectedGenderState] = useState(false);
  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };
  const [isLoading, setIsLoading] = useState(false);
  const initSocket = async () => {
    //@ts-ignore
    const initSocet = await dispatch(initializeSocket()).unwrap();
    console.log('initSocet', initSocet)
  }

  const initialValues = {
    fname: "",
    lname: "",
    Nname: "",
    email: "",
    Password: "",
    CPassword: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: SignupSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: async (values, action) => {
        if (selectedGender === "") {
          setSelectedGenderState(true);
          return;
        }
        setSelectedGenderState(false);
        const myHeaders = new Headers();
        myHeaders.append("Origin", "*");
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          data: {
            attributes: {
              firstName: values.fname,
              lastName: values.lname,
              email: values.email,
              nickName: values.Nname,
              gender: selectedGender,
              password: values.Password,
              confirmPassword: values.CPassword,
              role: navigateRole ? navigateRole : "user",
            },
          },
        });

        var requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        fetch(API_ENDPOINTS.REGISTRATION, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (
              result?.success &&
              (result?.status == 200 || result?.status == 201)
            ) {
              clearAllCookies();
              const Data = result?.data?.attributes;
              const authToken = Encrytion(result?.authToken);
              const Role = Encrytion(Data?.role);
              const Email = Encrytion(Data?.email);
              const FirstName = Encrytion(Data?.firstName);
              const LastName = Encrytion(Data?.lastName);
              const NickName = Encrytion(Data?.nickName);
              const Gender = Encrytion(Data?.gender);
              const Id = Encrytion(Data?.Id);

              storeToken("AccessToken", authToken);
              storeToken("FirstName", FirstName);
              storeToken("LastName", LastName);
              storeToken("NickName", NickName);
              storeToken("Email", Email);
              storeToken("Role", Role);
              storeToken("Id", Id);
              storeToken("Gender", Gender);
              setTimeout(() => {
                showMessage("Account created Successfully!");
              }, 2000);
              router.push("upload-profile");
              initSocket()
              // const authToken = result?.authToken;
              // const role = result?.data?.attributes?.role;
              // const token = Encrytion(authToken);
              // storeToken("AccessToken", token);
              // const newRole = Encrytion(role);
              // storeToken("Role", newRole);
              // router.push("upload-profile");
            } else {
              showMessage(result?.message, "error");
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      },
    });



  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      return null;
    }
  };

  const GoogleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setIsLoading(true);
      const userInfo = await fetchUserInfo(tokenResponse.access_token);
      console.log('userInfo', userInfo)

      if (userInfo) {
        const myHeaders = new Headers();
        myHeaders.append("Origin", "*");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          data: {
            attributes: {
              token: tokenResponse.access_token,
              userInfo: {
                email: userInfo?.email,
                nickname: userInfo?.given_name,
                firstname: userInfo?.family_name,
                lastname: userInfo?.given_name,
                role: 'user',
              },
            },
          },
        });

        const requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        try {
          const response = await fetch(API_ENDPOINTS.GOOGLELOGIN, requestOptions);
          const result = await response.json();
          const userData = result.data.attributes;

          if (result?.success && (result?.status == 200 || result?.status == 201)) {
            const authToken = Encrytion(result?.authToken);
            const Role = Encrytion(userData?.role);
            const Email = Encrytion(userData?.email);
            const Id = Encrytion(userData?.Id);

            storeToken("AccessToken", authToken);
            storeToken("Email", Email);
            storeToken("Role", Role);
            storeToken("Id", Id);

            const socialLoginData: any = {
              id: userData.Id,
              name: userData.firstName,
              lname: userData.lastName,
              email: userData.email,
            };
            dispatch(saveSocialLoginData(socialLoginData));
            setIsLoading(false);
            initSocket()
            if (result.isNewUser) {
              router.push("/social-login");
            } else {
              setIsLoading(false);
              setTimeout(() => {
                showMessage("Login Successful!");
              }, 2000);
              router.push("/feeling-today");
            }
          } else {
            setIsLoading(false);
            showMessage(result?.message, "error");
          }
        } catch (error) {
          setIsLoading(false);
          showMessage("Something went wrong!", "error");
          console.error("error", error);
        }
      } else {
        setIsLoading(false);
        showMessage("Failed to get user info!", "error");
      }
    },
    onError: error => {
      setIsLoading(false);
      showMessage("Login failed!", "error");
      console.error("Login Failed:", error);
    },
  });

  const FacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider).then((data) => {
        setIsLoading(true);
        const facebookData = data.user;
        const myHeaders = new Headers();
        myHeaders.append("Origin", "*");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          data: {
            attributes: {
              token: facebookData?.uid,
              userInfo: {
                email: facebookData?.email,
                nickname: facebookData?.displayName ?? "Test",
                firstname: facebookData?.displayName ?? "Demo",
                lastname: facebookData?.displayName ?? "Test",
                role: role ? role : "user",
              },
            },
          },
        });

        var requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(API_ENDPOINTS.FACEBOOKLOGIN, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            const userData = result.data.attributes;
            if (
              result?.success &&
              (result?.status == 200 || result?.status == 201)
            ) {
              const authToken = Encrytion(result?.authToken);
              const Role = Encrytion(result.data.attributes?.role);
              const Email = Encrytion(result.data.attributes?.email);
              storeToken("AccessToken", authToken);
              const Id = Encrytion(userData?.Id);

              storeToken("Email", Email);
              storeToken("Role", Role);
              storeToken("Id", Id);

              const socialLoginData: any = {
                id: userData.Id,
                name: userData.firstName,
                lname: userData.lastName,
                email: userData.email,
              };
              dispatch(saveSocialLoginData(socialLoginData));
              setIsLoading(false);
              initSocket()
              if (result.isNewUser) {
                router.push("/social-login");
              } else {
                setIsLoading(false);
                setTimeout(() => {
                  showMessage("Login Successfull!");
                }, 2000);
                router.push("/feeling-today");

              }
            } else {
              setIsLoading(false);
              showMessage(result?.message, "error");
            }
          })
          .catch((error) => {
            setIsLoading(false);
            showMessage("Something wents wrong!", "error");
            console.log("error", error);
          });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loaderScreen">
          <Loader />
        </div>
      )}
      <div className="bg-lightOrange min-h-[100vh] overflow-y-scroll  flex justify-center items-center">
        <div className="pt-[70px]">
          <CustomHeading FontWeight={700} title="Sign-up" />
          <form onSubmit={handleSubmit} className=" " noValidate>
            <div className="pt-[20px]">
              <div className="relative">
                <TextInput
                  placeholder="First name"
                  type="text"
                  name="fname"
                  value={values.fname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.fname && touched.fname && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px] ">
                    {errors.fname}
                  </p>
                )}
              </div>

              <div className="relative">
                <TextInput
                  placeholder="Last name"
                  type="text"
                  name="lname"
                  value={values.lname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.lname && touched.lname && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px]  ">
                    {errors.lname}
                  </p>
                )}
              </div>

              <div className="relative">
                <TextInput
                  placeholder="Nick name"
                  type="text"
                  name="Nname"
                  value={values.Nname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.Nname && touched.Nname && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px]  ">
                    {errors.Nname}
                  </p>
                )}{" "}
              </div>

              <div className="relative">
                <TextInput
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px]  ">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="relative">
                <TextInput
                  placeholder="Password"
                  type="password"
                  name="Password"
                  value={values.Password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.Password && touched.Password && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px]  ">
                    {" "}
                    {errors.Password}
                  </p>
                )}
              </div>

              <div className="relative">
                <TextInput
                  placeholder="Re-enter Password"
                  type="password"
                  name="CPassword"
                  value={values.CPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.CPassword && touched.CPassword && (
                  <p className=" absolute -bottom-5 ms-3 text-red-500 text-[13.5px]  ">
                    {errors.CPassword}
                  </p>
                )}
              </div>
            </div>
            <div className="pt-[48px]">
              <div className="sm:flex flex-column  items-center flex-wrap justify-center sm:gap-5 max-sm:gap-y-6">
                <p className="font-montserrat text-[17.5px] font-[700] text-center pe-5">
                  Gender
                </p>
                <div className="flex justify-center">
                  <div
                    className={`rounded-[49.635px] cursor-pointer bg-[#fff] sm:w-[118px] w-[70vw] max-sm:mt-3 h-[39px] flex items-center justify-center border-black ${selectedGender === "Male"
                      ? "border-black border-[1.2px] border-solid"
                      : ""
                      }`}
                    onClick={() => {
                      handleGenderSelect("Male");
                      setSelectedGenderState(false);
                    }}
                  >
                    <div className="font-montserrat font-[400] text-[#000] leading-normal text-[17.101px]">
                      Male
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div
                    className={`rounded-[49.635px] cursor-pointer bg-[#fff] sm:w-[118px] w-[70vw] max-sm:mt-3 h-[39px] flex items-center justify-center border-black ${selectedGender === "Female"
                      ? "border-black border-[1.2px] border-solid"
                      : ""
                      }`}
                    onClick={() => {
                      handleGenderSelect("Female");
                      setSelectedGenderState(false);
                    }}
                  >
                    <div className="font-montserrat font-[400] text-[#000] leading-normal text-[17.101px]">
                      Female
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div
                    className={`rounded-[49.635px] cursor-pointer bg-[#fff] sm:w-[118px] w-[70vw] max-sm:mt-3 h-[39px] flex items-center justify-center border-black ${selectedGender === "Private"
                      ? "border-black border-[1.2px] border-solid"
                      : ""
                      }`}
                    onClick={() => {
                      handleGenderSelect("Private");
                      setSelectedGenderState(false);
                    }}
                  >
                    <div className="font-montserrat font-[400] text-[#000] leading-normal text-[17.101px]">
                      Private
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
            {selectedGenderState ? (
              <div className="flex justify-start">
                <p className="  ms-3 text-red-500 text-[13.5px] ">
                  Select a gender
                </p>
              </div>
            ) : null}
            <div className="flex justify-center items-center pt-[33px]">
              <Button>Register</Button>
            </div>
          </form>

          <div className="pt-[33px] text-center">
            <div className="pt-[33px]">
              <div
                className="font-montserrat font-[500]
                             leading-normal text-[13px] text-black"
              >
                Already have an Account?{" "}
                <span className="font-[700] cursor-pointer">
                  <Link href={"/sign-in"}>SIGN IN</Link>
                </span>
              </div>
            </div>

            <div className="py-[12px] flex items-center flex-wrap justify-center gap-5">
              <div className="cursor-pointer" onClick={() => GoogleLogin()}>
                <GoogleIcon />
              </div>
              <div className="cursor-pointer" onClick={FacebookLogin}>
                <Image src={FacobookIcon} width={29} height={29} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
