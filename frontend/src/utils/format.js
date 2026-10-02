export const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const fmtDateTime = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const isOverdue = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

export const deadlineStatus = (deadline) => {
  if (!deadline) return { label: '—', variant: 'gray' };
  const d = new Date(deadline);
  const now = new Date();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: 'Overdue', variant: 'danger' };
  if (diff <= 3) return { label: `${diff}d left`, variant: 'warning' };
  return { label: fmtDate(deadline), variant: 'info' };
};

export const errMsg = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong';
