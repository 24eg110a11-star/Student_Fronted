export const STATUS_LABEL = { PENDING: 'Pending', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };
export const NEXT_STATUS = { PENDING: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED', COMPLETED: 'PENDING' };

export const formatDate = (iso) => {
  if (!iso) return '-';
  const d = iso.slice(0, 10).split('-');
  return d.length === 3 ? `${d[2]}-${d[1]}-${d[0]}` : iso;
};

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

// Returns { label, tone } for the deadline of a task.
export function deadlineInfo(task) {
  if (task.status === 'COMPLETED') return { label: 'Done', tone: 'success' };
  const [y, m, d] = task.dueDate.slice(0, 10).split('-').map(Number);
  const diff = Math.round((new Date(y, m - 1, d) - startOfToday()) / 86400000);
  if (diff < 0) return { label: 'Overdue', tone: 'danger' };
  if (diff === 0) return { label: 'Due Today', tone: 'warning' };
  if (diff === 1) return { label: 'Due Tomorrow', tone: 'warning' };
  if (diff <= 7) return { label: 'Due This Week', tone: 'info' };
  return { label: 'Upcoming', tone: 'muted' };
}
