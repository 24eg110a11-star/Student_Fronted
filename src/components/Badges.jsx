import { STATUS_LABEL, deadlineInfo } from '../utils.js';

export const PriorityBadge = ({ priority }) => (
  <span className={`badge priority-${priority}`}>{priority}</span>
);
export const StatusBadge = ({ status }) => (
  <span className={`badge status-${status}`}>{STATUS_LABEL[status] || status}</span>
);
export const DeadlineBadge = ({ task }) => {
  const { label, tone } = deadlineInfo(task);
  return <span className={`badge deadline-${tone}`}>{label}</span>;
};
