import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { incomeService } from '../../services/resourceServices';

export const fetchIncomes = createAsyncThunk('incomes/fetch', async (params, { rejectWithValue }) => {
  try {
    const res = await incomeService.list(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load income');
  }
});

export const addIncome = createAsyncThunk('incomes/add', async (data, { rejectWithValue }) => {
  try {
    const res = await incomeService.create(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add income');
  }
});

export const editIncome = createAsyncThunk('incomes/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await incomeService.update(id, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update income');
  }
});

export const removeIncome = createAsyncThunk('incomes/remove', async (id, { rejectWithValue }) => {
  try {
    await incomeService.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete income');
  }
});

const incomeSlice = createSlice({
  name: 'incomes',
  initialState: { items: [], pagination: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchIncomes.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(addIncome.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(editIncome.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeIncome.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default incomeSlice.reducer;
