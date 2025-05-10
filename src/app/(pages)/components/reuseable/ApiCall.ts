import API_ENDPOINTS from "@/app/components/ApiRoutes/apiRoutes";
import getAndDecryptCookie from "@/app/lib/auth";
import { channel } from "diagnostics_channel";

export const getUserChannels = async (url: string) => {
  try {
    const token = getAndDecryptCookie("AccessToken");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const uploadImage = async (file: File) => {
  const token = getAndDecryptCookie("AccessToken");
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const formdata = new FormData();
  formdata.append("attachment", file);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  const response = await fetch(API_ENDPOINTS.UPLOAD_PHOTO, requestOptions);
  const result = await response.json();
  return result;
};

export const likeMessage = async (id: string, type: string) => {
  try {
    let body = {};
    if (type == "post") {
      body = {
        data: { attributes: { postId: id } },
      };
    } else if (type == "message") {
      body = {
        data: { attributes: { messageId: id } },
      };
    } else {
      body = {
        data: { attributes: { commentId: id } },
      };
    }

    const token = getAndDecryptCookie("AccessToken");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(API_ENDPOINTS.LIKE_POST, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const res = await response.json();
      return res;
    } else {
      const error = await response.json();
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
export const shareMessage = async ({
  postId,
  channelId,
}: {
  postId: string | undefined;
  channelId: number | undefined;
}) => {
  try {
    // const body = { data: { attributes: { values } } };
    const body = {
      data: {
        attributes: { postId: postId, channelId: channelId },
      },
    };
    const token = getAndDecryptCookie("AccessToken");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(API_ENDPOINTS.SHARE_POST, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const res = await response.json();
      return res;
    } else {
      const error = await response.json();
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
