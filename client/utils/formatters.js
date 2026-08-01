export function formatCurrency(amount, currency = 'NGN') {
  const value = Number(amount || 0);
  try {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(value);
  } catch {
    return `₦${value.toFixed(2)}`;
  }
}

export function formatDate(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatShortDate(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function toISODateOnly(date) {
  return new Date(date).toISOString().slice(0, 10);
}
