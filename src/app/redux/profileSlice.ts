import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface ProfileState {
  name: string | null;
  bannerImage: string | null;
  category: string | null;
  location: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  placeId: string | null;
  bio: string | null;
  image: string | null;
}

// Function to retrieve profile data from cookies
const getProfileDataFromCookies = (): ProfileState => {
  const profileDataFromCookies = Cookies.get("profileData");
  if (profileDataFromCookies) {
    return JSON.parse(profileDataFromCookies);
  } else {
    return {
      name: null,
      bannerImage: null,
      category: null,
      location: null,
      address: null,
      latitude: null,
      longitude: null,
      placeId: null,
      bio: null,
      image: null,
    };
  }
};

const initialState: ProfileState = getProfileDataFromCookies(); // Initialize state with profile data from cookies

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    saveProfileData(state, action: PayloadAction<ProfileState>) {
      const { name, bannerImage, category, location, address, latitude, longitude, placeId, bio, image } = action.payload;
      // Save profile data to cookies
      Cookies.set("profileData", JSON.stringify({ name, bannerImage, category, location, address, latitude, longitude, placeId, bio, image }));
      return { ...state, ...action.payload };
    },
  },
});

export const { saveProfileData } = profileSlice.actions;
export default profileSlice.reducer;
