// templatesDataSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DealsData {
  id: string;
  discount: string;
  offer: string;
  image: string;
  dealNumber: string;
  title: string;
  userId: string;
  createdAt: string;
  __v: number;
}

interface TemplatesDataState {
  isLoading: boolean;
  error: string | null;
  dealsList: DealsData[];
}

const initialState: TemplatesDataState = {
  isLoading: false,
  error: null,
  dealsList: [],
};

const templatesDataSlice = createSlice({
  name: 'templatesData',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    saveDealsList(state, action: PayloadAction<DealsData[]>) {
      state.dealsList = action.payload;
    },
  },
});

export const { setLoading, setError, saveDealsList } = templatesDataSlice.actions;
export default templatesDataSlice.reducer;
