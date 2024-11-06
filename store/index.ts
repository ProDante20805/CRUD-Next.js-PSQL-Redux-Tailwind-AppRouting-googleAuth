import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import usersReducer from './usersSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    users: usersReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
