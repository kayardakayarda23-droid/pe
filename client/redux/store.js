import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expenseReducer from './slices/expenseSlice';
import incomeReducer from './slices/incomeSlice';
import budgetReducer from './slices/budgetSlice';
import { dashboardReducer, categoryReducer, analyticsReducer } from './slices/miscSlices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    incomes: incomeReducer,
    budgets: budgetReducer,
    dashboard: dashboardReducer,
    categories: categoryReducer,
    analytics: analyticsReducer,
  },
});
