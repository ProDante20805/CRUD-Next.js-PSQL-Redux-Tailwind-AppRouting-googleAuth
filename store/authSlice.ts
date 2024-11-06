// src/store/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState = {
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
});

export const { setMessage } = authSlice.actions;
export default authSlice.reducer;
