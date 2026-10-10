import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge, DeadlineBadge } from './Badges.jsx';
import { formatDate, NEXT_STATUS, STATUS_LABEL } from '../utils.js';

export default function TaskTable({ tasks, onDelete, onStatus }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr><th>Task</th><th>Subject</th><th>Priority</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className={t.status !== 'COMPLETED' && t.dueDate < new Date().toISOString().slice(0, 10) ? 'row-overdue' : ''}>
              <td data-label="Task"><Link to={`/tasks/${t.id}`} className="link">{t.title}</Link></td>
              <td data-label="Subject">{t.subject}</td>
              <td data-label="Priority"><PriorityBadge priority={t.priority} /></td>
              <td data-label="Due Date">{formatDate(t.dueDate)} <DeadlineBadge task={t} /></td>
              <td data-label="Status"><StatusBadge status={t.status} /></td>
              <td data-label="Actions" className="actions">
                <Link className="btn btn-light btn-sm" to={`/tasks/${t.id}`}>View</Link>
                <Link className="btn btn-light btn-sm" to={`/tasks/edit/${t.id}`}>Edit</Link>
                <button className="btn btn-primary btn-sm" onClick={() => onStatus(t, NEXT_STATUS[t.status])}
                  title="Move to next status">→ {STATUS_LABEL[NEXT_STATUS[t.status]]}</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(t)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
