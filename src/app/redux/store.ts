
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import userProfileReducer from './users/profileSlice';
import dealsReducer from './dealsSlice';
import socialLoginReducer from './socialLogin';
import templatesDataReducer from './templatesDataSlice';
import placesReducer from './placesSlice';
import userChatReducer from './users/userChat';
import editModeReducer from './editModeSlice';
import userReducer from './userProfileSlice'; // Adjust the path as needed
import imageReducer from './imageSlice';
import discussionsReducer from './discussionsSlice';
import notificationReducer from './users/notificationSlice';

// Configure the store
const store = configureStore({
  reducer: {
    profile: profileReducer,
    userProfile: userProfileReducer,
    deals: dealsReducer,
    user: userReducer,
    discussions: discussionsReducer,
    image: imageReducer,
    templatesData: templatesDataReducer,
    notification: notificationReducer,
    places: placesReducer,
    socialLogin: socialLoginReducer,
    editMode: editModeReducer,
    sockets: userChatReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
