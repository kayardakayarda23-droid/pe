import api from './api';

export const expenseService = {
  list: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => {
    const form = toFormData(data);
    return api.post('/expenses', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  update: (id, data) => {
    const form = toFormData(data);
    return api.put(`/expenses/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  remove: (id) => api.delete(`/expenses/${id}`),
};

function toFormData(data) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'receipt' && value?.uri) {
      form.append('receipt', { uri: value.uri, name: value.name || 'receipt.jpg', type: value.type || 'image/jpeg' });
    } else {
      form.append(key, String(value));
    }
  });
  return form;
}
