import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/authService';

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const res = await authService.register(name, email, password);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await authService.login(email, password);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const restoreSession = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) return rejectWithValue('No stored session');
  try {
    const res = await authService.getProfile();
    return { user: res.data.data, token };
  } catch (err) {
    await AsyncStorage.removeItem('authToken');
    return rejectWithValue('Session expired');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('authToken');
});

const initialState = {
  user: null,
  token: null,
  status: 'idle', // idle | loading | succeeded | failed
  bootstrapped: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        AsyncStorage.setItem('authToken', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        AsyncStorage.setItem('authToken', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(restoreSession.pending, (state) => { state.bootstrapped = false; })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.bootstrapped = true;
      })
      .addCase(restoreSession.rejected, (state) => { state.bootstrapped = true; })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
