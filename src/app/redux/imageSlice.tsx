// imageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { RootState } from './store'; // Make sure this path is correct

const COOKIE_KEY = 'mainBannerImage';

interface ImageState {
  mainBannerImage: string | null;
}

// Get initial state from cookies or use default initialState
const initialState: ImageState = {
  mainBannerImage: Cookies.get(COOKIE_KEY) || null,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<string | null>) => {
      state.mainBannerImage = action.payload;
      // Save to cookies whenever the state changes
      Cookies.set(COOKIE_KEY, action.payload || '');
    },
  },
});

export const { setImage } = imageSlice.actions;

// Selector to get the image details from the state
export const selectMainBannerImage = (state: RootState) => state.image.mainBannerImage;

export default imageSlice.reducer;
