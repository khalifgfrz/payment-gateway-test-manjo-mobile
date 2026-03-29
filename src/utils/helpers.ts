export const getStatusColor = (status?: string) => {
  const upperStatus = status?.toUpperCase();
  switch (upperStatus) {
    case 'SUCCESS':
      return { bgColor: '#dcfce7', textColor: '#166534', borderColor: '#86efac' };
    case 'PENDING':
      return { bgColor: '#fef3c7', textColor: '#b45309', borderColor: '#fcd34d' };
    case 'FAILED':
      return { bgColor: '#fee2e2', textColor: '#991b1b', borderColor: '#fca5a5' };
    default:
      return { bgColor: '#f3f4f6', textColor: '#374151', borderColor: '#d1d5db' };
  }
};

export const getStatusBadgeColor = (status?: string) => {
  const upperStatus = status?.toUpperCase();
  switch (upperStatus) {
    case 'SUCCESS':
      return { backgroundColor: '#dcfce7', color: '#166534' };
    case 'PENDING':
      return { backgroundColor: '#fef3c7', color: '#b45309' };
    case 'FAILED':
      return { backgroundColor: '#fee2e2', color: '#991b1b' };
    default:
      return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

export const getStatusIcon = (status?: string) => {
  const upperStatus = status?.toUpperCase();
  switch (upperStatus) {
    case 'SUCCESS':
      return '✓';
    case 'PENDING':
      return '⏳';
    case 'FAILED':
      return '✕';
    default:
      return '•';
  }
};

export const formatCurrency = (value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
