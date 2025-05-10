"use client";
import React, { useEffect, useState } from "react";
import BaloonIcon from "@/app/components/reuseables/Svgs/BaloonIcon";
import StarIcon from "@/app/components/reuseables/Svgs/StarIcon";
import TextInput from "../components/InputFields";
import Button from "../components/Button";
import Link from "next/link";
import FacobookIcon from "../../../../assets/svgs/auth/FacebookIcon.svg";
import CustomHeading from "@/app/components/reuseables/CustomHeading";
import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import { LoginSchema } from "@/app/schema/signin";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import secureLocalStorage from "react-secure-storage";
import { showMessage } from "@/app/components/reuseables/Notification";
import getAndDecryptCookie, {
  clearAllCookies,
  Encrytion,
  storeToken,
} from "@/app/lib/auth";
import { saveSocialLoginData } from "@/app/redux/socialLogin";
import {
  auth,
  provider,
  facebookProvider,
} from "@/app/components/common/firebase/common";
import "../../../globals.css";
import { Loader } from "@/app/components/reuseables/Svgs/Loader";
import GoogleIcon from "@/app/components/reuseables/Svgs/GoogleIcon";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";

const Signin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    email: "",
    Password: "",
  };
  const token = getAndDecryptCookie("AccessToken");
  const navigateRole = getAndDecryptCookie("role");
  const role = getAndDecryptCookie("Role");

  const dispatch = useDispatch();
  const initSocket = async () => {
    //@ts-ignore
    const initSocet = await dispatch(initializeSocket()).unwrap();
    console.log('initSocet', initSocet)
  }
  useEffect(() => {

    if (role === "user" && token) {
      router.push("/feeling-today");
    } else if (role === "business" && token) {
      router.push("/business/dashboard");
    }
    window.scrollTo(0, 0)
  }, []);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: LoginSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: (values: any, action: any) => {
        setIsLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Origin", "*");
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          data: {
            attributes: {
              email: values.email,
              password: values.Password,
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
        fetch(API_ENDPOINTS.LOGIN, requestOptions)
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
              if (Data?.role === "business") {
                const Id = Encrytion(Data?.Id);
                const ContactNo = Encrytion(Data?.contactNo);
                const AboutMe = Encrytion(Data?.aboutMe);

                storeToken("AccessToken", authToken);
                storeToken("Email", Email);
                storeToken("Role", Role);
                storeToken("Id", Id);
                storeToken("ContactNo", ContactNo);
                storeToken("AboutMe", AboutMe);
                setTimeout(() => {
                  showMessage("Login Successfull!");
                }, 2000)
                initSocket()

                router.push("/business/dashboard");

              } else if (Data?.role === "user") {
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
                  showMessage("Login Successfull!");
                }, 2000)
                router.push("/feeling-today");


              }
            } else {
              showMessage(result?.message || errors, "error");
              setIsLoading(false);
            }
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.log(error);
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
              storeToken("Email", Email);
              storeToken("Role", Role);

              const socialLoginData: any = {
                id: userData.Id,
                name: userData.firstName,
                lname: userData.lastName,
                email: userData.email,
              };
              dispatch(saveSocialLoginData(socialLoginData));
              setIsLoading(false);
              if (result.isNewUser) {
                router.push("/social-login");
              } else {
                setIsLoading(false);
                setTimeout(() => {
                  router.push("/feeling-today");
                }, 3000);
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
      <div className="bg-purple h-svh flex flex-col justify-center items-center relative">
        <div className="absolute max-sm:top-[1%] max-2xl:top-[0%] top-[0%] max-sm:left-[0%] max-md:left-[0%] max-lg:left-[0%] max-xl:left-[0%] max-2xl:left-[10%] left-[10%] pr-12 pb-12">
          <BaloonIcon />
        </div>
        <div>
          <div className="">
            <CustomHeading FontWeight={700} title="Sign-in" />

            <form onSubmit={handleSubmit} className=" " noValidate>
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
                  <p className="absolute -bottom-5 ms-3 translate-y-2 text-red-500 text-[14px]  ">
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
                  <p className="absolute -bottom-5 ms-3 text-red-500 text-[14px] ">
                    {" "}
                    {errors.Password}
                  </p>
                )}
              </div>

              <div className="text-center pt-[19px]">
                <div>
                  <Link href={"/forget-password"} className="">
                    <div className="font-montserrat cursor-pointer font-[700]  text-black text-[13px]">
                      Forgot Password?{" "}
                    </div>
                  </Link>
                  <div className="pt-[40px]">
                    <Button>Login</Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {navigateRole === "user" && (
            <div className="py-[12px] flex items-center flex-wrap justify-center gap-5">
              <div className="cursor-pointer" onClick={() => GoogleLogin()}>
                <GoogleIcon />
              </div>
              <div className="cursor-pointer" onClick={FacebookLogin}>
                <Image src={FacobookIcon} width={29} height={29} alt="" />
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 right-[6%] sm:right-0 sm:pr-12 sm:pb-12">
          <StarIcon />
        </div>
      </div>
    </>
  );
};

export default Signin;
