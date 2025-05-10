// store/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  count: number;
  isCountWorking: boolean;
}

const initialState: NotificationState = {
  count: 0,
  isCountWorking: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    setIsCountWorking(state, action: PayloadAction<boolean>) {
      state.isCountWorking = action.payload;
    },
  },
});

export const { setNotificationCount, setIsCountWorking } = notificationSlice.actions;
export default notificationSlice.reducer;
