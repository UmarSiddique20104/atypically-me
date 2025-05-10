import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface UserProfileState {
  nickName?: string | null;
  image?: string | null;
  channelName?: string | undefined;
}

// Function to retrieve profile data from cookies
const getProfileDataFromCookies = (): UserProfileState => {
  const profileDataFromCookies = Cookies.get("userProfileData");
  if (profileDataFromCookies) {
    return JSON.parse(profileDataFromCookies);
  } else {
    return {
      nickName: null,
      image: null,
    };
  }
};

const initialState: UserProfileState = getProfileDataFromCookies(); // Initialize state with profile data from cookies

const profileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    saveUserProfileData(state, action: PayloadAction<UserProfileState>) {
      const { nickName, image } = action.payload;
      // Save profile data to cookies
      Cookies.set("userProfileData", JSON.stringify({ nickName, image }));
      return { ...state, nickName, image };
    },
    addChannelName(state, action: PayloadAction<{ channelName: string }>) {
      state.channelName = action.payload.channelName;
    },
  },
});

export const { saveUserProfileData, addChannelName } = profileSlice.actions;
export default profileSlice.reducer;
