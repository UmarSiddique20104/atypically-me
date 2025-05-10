// src/store/discussionsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Discussion } from '../../types/types';
import Cookies from 'js-cookie';

interface DiscussionsState {
    discussions: Discussion[];
}

const initialState: DiscussionsState = {
    discussions: []
};

const discussionsSlice = createSlice({
    name: 'discussions',
    initialState,
    reducers: {
        setDiscussion(state, action: PayloadAction<Discussion[]>) {
            state.discussions = action.payload;
            Cookies.set('discussions', JSON.stringify(action.payload), { expires: 7 });
        },
        loadDiscussionsFromCookies(state) {
            const discussionsFromCookies = Cookies.get('discussions');
            if (discussionsFromCookies) {
                state.discussions = JSON.parse(discussionsFromCookies);
            }
        }
    }
});

export const { setDiscussion, loadDiscussionsFromCookies } = discussionsSlice.actions;
export default discussionsSlice.reducer;
