"use client"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocialLoginState {
  id: string,
  name: string,
  lname:string,
  email: string
}

const initialState: SocialLoginState = {
  id: '',
  name: '',
  lname:'',
  email: ''
};

const socialLoginSlice = createSlice({
  name: 'socialLogin',
  initialState,
  reducers: {
    saveSocialLoginData(state, action: PayloadAction<SocialLoginState>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.lname = action.payload.lname;
      state.email = action.payload.email;
    },
  },
});

export const { saveSocialLoginData } = socialLoginSlice.actions;
export default socialLoginSlice.reducer;
