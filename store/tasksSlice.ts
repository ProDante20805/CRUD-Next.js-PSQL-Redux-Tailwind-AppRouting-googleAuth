import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../lib/axios';

interface Task {
  id: number;
  title: string;
}

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk<Task[]>('tasks/fetchTasks', async () => {
  const response = await axios.get('/api/tasks');
  return response.data.tasks;
});

// Async thunk to add a task
export const addTask = createAsyncThunk<Task, string>('tasks/addTask', async (title) => {
  const response = await axios.post('/api/tasks', { title });
  return response.data;
});

// Async thunk to edit a task
export const editTask = createAsyncThunk<Task, { id: number; title: string }>(
  'tasks/editTask',
  async ({ id, title }) => {
    const response = await axios.put(`/api/tasks/${id}`, { title });
    return response.data;
  }
);

// Async thunk to delete a task
export const deleteTask = createAsyncThunk<number, number>('tasks/deleteTask', async (id) => {
  await axios.delete(`/api/tasks/${id}`);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: false, error: null } as TasksState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(task => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
