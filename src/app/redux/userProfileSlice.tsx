// userProfileSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    userProfile: any; // Define a type for userProfile based on your API response structure
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    userProfile: null,
    isLoading: false,
    error: null,
};

const userProfileSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserProfiles(state, action: PayloadAction<any>) {
            state.userProfile = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { setUserProfiles, setLoading, setError } = userProfileSlice.actions;
export default userProfileSlice.reducer;
