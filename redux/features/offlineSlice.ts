import { createSlice } from '@reduxjs/toolkit';

const offlineSlice = createSlice({
  name: 'offline',
  initialState: false,
  reducers: {
    setOfflineMode: (state, action) => {
      return action.payload;
    },
  },
});

export const { setOfflineMode } = offlineSlice.actions;
export default offlineSlice.reducer;