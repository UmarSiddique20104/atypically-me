import Cookies from 'js-cookie'
import crypto from "crypto-js";


export function storeToken(value: string, token: string) {

  Cookies.set(value, token, {
    // httpOnly: true,
    sameSite: 'strict',
    secure: true,
    expires: 7
  })
}

export function getToken(value: string) {
  return Cookies.get(value)
}


const cookiesToClear = [
  'AccessToken', 'Email', 'Role','role',
  'BusinessName', 'BusinessCategory', 'ContactNo',
  'AboutMe', 'Location', 'FirstName',
  'LastName', 'NickName', 'Gender', 'Id',
  'latitude', 'longitude', 'placeId', 'BusinessImage',
   'Bio','address','BannerImage','Image','profileData',
   'dealsList','userProfileData'
];
export function clearAllCookies() {
  cookiesToClear.forEach(cookieName => {
    if (Cookies.get(cookieName)) {
      Cookies.remove(cookieName, {
        path: '/',
        maxAge: 0,
      });
    }
  });
}

export const Encrytion = (value: any) => {

  const encryptedValue = crypto.AES.encrypt(
    value,
    "virtuenetz"
  ).toString();

  return encryptedValue
}

export const Decrytion = (value: any) => {

  const decryptedValue = crypto.AES.decrypt(
    value,
    "virtuenetz"
  ).toString(crypto.enc.Utf8)

  return decryptedValue
}


const getAndDecryptCookie = (cookieName: string) => {
  const encryptedValue = Cookies.get(cookieName);
  if (encryptedValue) {
    const decryptedValue = Decrytion(encryptedValue);
    return decryptedValue;
  }
  return null;
};

export default getAndDecryptCookie;
