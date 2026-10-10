import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { taskApi, errorMessage } from '../services/api.js';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { PriorityBadge, StatusBadge, DeadlineBadge } from '../components/Badges.jsx';
import { formatDate } from '../utils.js';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    taskApi.get(id).then((r) => setTask(r.data))
      .catch((e) => setError(e.response?.status === 404 ? 'Task not found.' : errorMessage(e)));
  }, [id]);

  const remove = async () => {
    setBusy(true);
    try { await taskApi.remove(id); navigate('/tasks'); }
    catch (e) { setError(errorMessage(e)); setConfirm(false); }
    finally { setBusy(false); }
  };

  if (error && !task) return <><Alert>{error}</Alert><Link className="btn btn-light" to="/tasks">Back to Tasks</Link></>;
  if (!task) return <Loading />;

  const row = (label, value) => (<div className="detail-row"><span className="detail-label">{label}</span><div>{value}</div></div>);
  return (
    <>
      <h1>Task Details</h1>
      <Alert>{error}</Alert>
      <div className="card details">
        {row('Title', task.title)}
        {row('Subject', task.subject)}
        {row('Description', task.description || '—')}
        {row('Priority', <PriorityBadge priority={task.priority} />)}
        {row('Due Date', <>{formatDate(task.dueDate)} <DeadlineBadge task={task} /></>)}
        {row('Status', <StatusBadge status={task.status} />)}
        {row('Created On', formatDate(task.createdAt))}
        {row('Last Updated', formatDate(task.updatedAt))}
        <div className="form-actions">
          <Link className="btn btn-primary" to={`/tasks/edit/${task.id}`}>Edit Task</Link>
          <button className="btn btn-danger" onClick={() => setConfirm(true)}>Delete Task</button>
          <Link className="btn btn-light" to="/tasks">Back to Tasks</Link>
        </div>
      </div>
      {confirm && <ConfirmModal message="Are you sure you want to delete this task?" busy={busy}
        onCancel={() => setConfirm(false)} onConfirm={remove} />}
    </>
  );
}
