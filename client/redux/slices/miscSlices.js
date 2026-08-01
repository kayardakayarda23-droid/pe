import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService, categoryService, analyticsService } from '../../services/resourceServices';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await dashboardService.get();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load dashboard');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.status = 'succeeded'; state.data = action.payload; })
      .addCase(fetchDashboard.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export const fetchCategories = createAsyncThunk('categories/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await categoryService.list();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load categories');
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export const fetchAnalysis = createAsyncThunk('analytics/fetchAnalysis', async (period, { rejectWithValue }) => {
  try {
    const res = await analyticsService.getAnalysis(period);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load analysis');
  }
});

export const fetchIncomeVsExpense = createAsyncThunk('analytics/incomeVsExpense', async (months, { rejectWithValue }) => {
  try {
    const res = await analyticsService.incomeVsExpense(months);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load trend');
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { analysis: null, trend: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalysis.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAnalysis.fulfilled, (state, action) => { state.status = 'succeeded'; state.analysis = action.payload; })
      .addCase(fetchAnalysis.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(fetchIncomeVsExpense.fulfilled, (state, action) => { state.trend = action.payload; });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
export const categoryReducer = categorySlice.reducer;
export const analyticsReducer = analyticsSlice.reducer;
