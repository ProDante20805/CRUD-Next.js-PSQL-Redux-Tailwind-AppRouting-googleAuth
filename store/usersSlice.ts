import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../lib/axios';

interface User {
  id: number;
  title: string;
}

interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
}

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
  const response = await axios.get('/api/users');
  return response.data.users;
});

// Async thunk to add a user
export const addUser = createAsyncThunk<User, string>('users/addUser', async (title) => {
  const response = await axios.post('/api/users', { title });
  return response.data;
});

// Async thunk to edit a user
export const editUser = createAsyncThunk<User, { id: number; title: string }>(
  'users/editUser',
  async ({ id, title }) => {
    const response = await axios.put(`/api/users/${id}`, { title });
    return response.data;
  }
);

// Async thunk to delete a user
export const deleteUser = createAsyncThunk<number, number>('users/deleteUser', async (id) => {
  await axios.delete(`/api/users/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, error: null } as UsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.items.push(action.payload);
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.items.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(user => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
