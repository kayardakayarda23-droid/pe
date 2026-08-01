import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { budgetService } from '../../services/resourceServices';

export const fetchBudgets = createAsyncThunk('budgets/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await budgetService.list();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load budgets');
  }
});

export const addBudget = createAsyncThunk('budgets/add', async (data, { rejectWithValue }) => {
  try {
    const res = await budgetService.create(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add budget');
  }
});

export const editBudget = createAsyncThunk('budgets/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await budgetService.update(id, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update budget');
  }
});

export const removeBudget = createAsyncThunk('budgets/remove', async (id, { rejectWithValue }) => {
  try {
    await budgetService.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete budget');
  }
});

const budgetSlice = createSlice({
  name: 'budgets',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBudgets.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchBudgets.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(addBudget.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(editBudget.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      });
  },
});

export default budgetSlice.reducer;
