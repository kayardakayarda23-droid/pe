import api, { BASE_URL } from './api';

export const incomeService = {
  list: (params) => api.get('/income', { params }),
  create: (data) => api.post('/income', data),
  update: (id, data) => api.put(`/income/${id}`, data),
  remove: (id) => api.delete(`/income/${id}`),
};

export const budgetService = {
  list: () => api.get('/budgets'),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  remove: (id) => api.delete(`/budgets/${id}`),
};

export const categoryService = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const dashboardService = {
  get: () => api.get('/dashboard'),
};

export const analyticsService = {
  getAnalysis: (period) => api.get(`/analytics/${period}`),
  incomeVsExpense: (months = 6) => api.get('/analytics/income-vs-expense', { params: { months } }),
};

export const reportService = {
  history: () => api.get('/reports/history'),
  // Returns the download URL — actual file fetch/save is handled by the
  // Reports screen via expo-file-system, since this needs binary handling
  // that a plain axios call doesn't give us cleanly for React Native.
  downloadUrl: (type, format, params = {}) => {
    const query = new URLSearchParams({ format, ...params }).toString();
    return `${BASE_URL}/reports/${type}?${query}`;
  },
};

export const notificationService = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  updatePreferences: (data) => api.put('/notifications/preferences', data),
};
