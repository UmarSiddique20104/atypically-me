// src/store/placesSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import Cookies from 'js-cookie';

// Define a key for cookies
const COOKIE_KEY = 'placeDetails';

// Interface for PlaceState
interface PlaceState {
    id: string;
    name: string;
    rating: number;
    totalRatings: number;
    type: string;
    distance: number;
    images: string[];
    address: string;
    open: boolean;
    openingTime?: string;
    closingTime?: string;
    website: string;
    url: string;
    ratingPercentage?: number[];
    isRated?: boolean;
    userRatings?: number;
}

// Get initial state from cookies or use default initialState
const initialState: PlaceState = JSON.parse(Cookies.get(COOKIE_KEY) || 'null') || {
    id: '',
    name: '',
    rating: 0,
    totalRatings: 0,
    type: '',
    distance: 0,
    images: [],
    address: '',
    open: false,
    website: '',
    url: '',
};

const placesSlice = createSlice({
    name: 'places',
    initialState,
    reducers: {
        setPlaceDetails: (state, action: PayloadAction<PlaceState>) => {
            const newState = { ...state, ...action.payload };
            // Save to cookies whenever the state changes
            Cookies.set(COOKIE_KEY, JSON.stringify(newState));
            return newState;
        },
    },
});

export const { setPlaceDetails } = placesSlice.actions;

// Selector to get the place details from the state
export const selectPlaceDetails = (state: RootState) => state.places;

export default placesSlice.reducer;
