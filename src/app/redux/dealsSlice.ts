
"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deal } from '@/types/deals';
import Cookies from 'js-cookie';

interface DealsState {
  dealsList: Deal[];
}

const initialState: DealsState = {
  dealsList: typeof window !== 'undefined' && Cookies.get('dealsList')
    ? JSON.parse(Cookies.get('dealsList') as string)
    : [],
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    saveDealData(state, action: PayloadAction<Deal>) {
      state.dealsList = [action.payload];
      Cookies.set('dealsList', JSON.stringify(state.dealsList), { expires: 7 });
    },
  },
});

export const { saveDealData } = dealsSlice.actions;
export default dealsSlice.reducer;



