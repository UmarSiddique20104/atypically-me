import { createSlice } from '@reduxjs/toolkit';

export const editModeSlice = createSlice({
  name: 'editMode',
  initialState: {
    isEditing: false,
  },
  reducers: {
    setEditMode: (state, action) => {
      state.isEditing = action.payload;
    },
  },
});

export const { setEditMode } = editModeSlice.actions;
export default editModeSlice.reducer;
