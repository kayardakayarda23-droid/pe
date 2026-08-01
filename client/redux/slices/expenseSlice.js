import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expenseService } from '../../services/expenseService';

export const fetchExpenses = createAsyncThunk('expenses/fetch', async (params, { rejectWithValue }) => {
  try {
    const res = await expenseService.list(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load expenses');
  }
});

export const addExpense = createAsyncThunk('expenses/add', async (data, { rejectWithValue }) => {
  try {
    const res = await expenseService.create(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add expense');
  }
});

export const editExpense = createAsyncThunk('expenses/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await expenseService.update(id, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update expense');
  }
});

export const removeExpense = createAsyncThunk('expenses/remove', async (id, { rejectWithValue }) => {
  try {
    await expenseService.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete expense');
  }
});

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: { items: [], pagination: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExpenses.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(addExpense.fulfilled, (state, action) => { state.items.unshift(action.payload); })

      .addCase(editExpense.fulfilled, (state, action) => {
        const idx = state.items.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      .addCase(removeExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
      });
  },
});

export default expenseSlice.reducer;
