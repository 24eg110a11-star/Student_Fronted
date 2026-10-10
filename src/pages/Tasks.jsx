import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskApi, errorMessage } from '../services/api.js';
import TaskTable from '../components/TaskTable.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';

const TITLES = { all: 'My Tasks', upcoming: 'Upcoming Tasks', completed: 'Completed Tasks' };

export default function Tasks({ view = 'all' }) {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: 'error', text: '' });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({ priority: '', status: '', subject: '', dueDate: '' });
  const [sortBy, setSortBy] = useState(view === 'upcoming' ? 'dueDate' : 'createdAt');
  const [order, setOrder] = useState(view === 'upcoming' ? 'asc' : 'desc');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sortBy, order };
      if (keyword.trim()) params.keyword = keyword.trim();
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      if (view === 'completed') params.status = 'COMPLETED';
      if (view === 'upcoming') params.upcoming = 'true';
      const [t, s] = await Promise.all([taskApi.list(params), taskApi.subjects()]);
      setTasks(t.data); setSubjects(s.data);
    } catch (e) {
      setMsg({ type: 'error', text: e.response ? 'Unable to load tasks.' : errorMessage(e) });
    } finally { setLoading(false); }
  }, [keyword, filters, sortBy, order, view]);

  // Results update dynamically (debounced while typing)
  useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);

  const setFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const changeStatus = async (task, status) => {
    try {
      await taskApi.setStatus(task.id, status);
      setMsg({ type: 'success', text: 'Task updated successfully.' });
      load();
    } catch (e) { setMsg({ type: 'error', text: errorMessage(e) }); }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await taskApi.remove(toDelete.id);
      setMsg({ type: 'success', text: 'Task deleted successfully.' });
      setToDelete(null);
      load();
    } catch (e) { setMsg({ type: 'error', text: errorMessage(e) }); }
    finally { setDeleting(false); }
  };

  return (
    <>
      <div className="page-head">
        <h1>{TITLES[view]}</h1>
        <Link className="btn btn-primary" to="/tasks/add">+ Add Task</Link>
      </div>
      <Alert type={msg.type} onClose={() => setMsg({ ...msg, text: '' })}>{msg.text}</Alert>

      <div className="card toolbar">
        <input className="search" placeholder="Search tasks..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <select name="priority" value={filters.priority} onChange={setFilter}>
          <option value="">Priority: All</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option>
        </select>
        {view !== 'completed' && (
          <select name="status" value={filters.status} onChange={setFilter}>
            <option value="">Status: All</option>
            <option value="PENDING">PENDING</option><option value="IN_PROGRESS">IN_PROGRESS</option><option value="COMPLETED">COMPLETED</option>
          </select>
        )}
        <select name="subject" value={filters.subject} onChange={setFilter}>
          <option value="">Subject: All</option>
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input type="date" name="dueDate" value={filters.dueDate} onChange={setFilter} title="Due date" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Sort: Created date</option>
          <option value="dueDate">Sort: Due date</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Task name</option>
          <option value="status">Sort: Status</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option><option value="desc">Descending</option>
        </select>
        <button className="btn btn-light" onClick={() => { setKeyword(''); setFilters({ priority: '', status: '', subject: '', dueDate: '' }); }}>Clear</button>
      </div>

      {loading ? <Loading /> : tasks.length === 0 ? (
        <div className="card empty">
          <h3>No tasks found.</h3>
          <p>Create your first task to start managing your academic work.</p>
          <Link className="btn btn-primary" to="/tasks/add">+ Add New Task</Link>
        </div>
      ) : (
        <TaskTable tasks={tasks} onDelete={setToDelete} onStatus={changeStatus} />
      )}

      {toDelete && (
        <ConfirmModal message="Are you sure you want to delete this task?" busy={deleting}
          onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
      )}
    </>
  );
}
