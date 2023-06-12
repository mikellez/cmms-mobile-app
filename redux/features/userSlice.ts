import { createSlice } from '@reduxjs/toolkit';
import { CMMSUser } from '../../types/interfaces';

const initialState: CMMSUser = {
  id: 0,
  role_id: 0,
  role_name: "",
  name: "",
  email: "",
  fname: "",
  lname: "",
  username: "",
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: (state) => {
      return initialState;
    }
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;