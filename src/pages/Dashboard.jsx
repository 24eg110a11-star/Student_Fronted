import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { dashboardApi, taskApi, errorMessage } from '../services/api.js';
import DashboardCard from '../components/DashboardCard.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';
import { PriorityBadge, DeadlineBadge, StatusBadge } from '../components/Badges.jsx';
import { formatDate } from '../utils.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([dashboardApi.get(), taskApi.list({ sortBy: 'createdAt', order: 'desc' })])
      .then(([s, t]) => { setStats(s.data); setTasks(t.data); })
      .catch((e) => setError(e.response ? 'Unable to load tasks.' : errorMessage(e)));
  }, []);

  if (error) return <Alert>{error}</Alert>;
  if (!stats) return <Loading />;

  const open = tasks.filter((t) => t.status !== 'COMPLETED');
  const upcoming = [...open].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
  const recent = tasks.slice(0, 5);
  const high = open.filter((t) => t.priority === 'HIGH').slice(0, 5);

  const List = ({ title, items, empty }) => (
    <section className="card">
      <h3>{title}</h3>
      {items.length === 0 ? <p className="muted">{empty}</p> : (
        <ul className="mini-list">
          {items.map((t) => (
            <li key={t.id}>
              <div>
                <Link className="link" to={`/tasks/${t.id}`}>{t.title}</Link>
                <div className="muted small">{t.subject} · {formatDate(t.dueDate)}</div>
              </div>
              <div className="mini-badges">
                {title === 'Recent Tasks' ? <StatusBadge status={t.status} />
                  : title === 'Priority Tasks' ? <PriorityBadge priority={t.priority} />
                  : <DeadlineBadge task={t} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  return (
    <>
      <h1>Welcome, {user?.name?.split(' ')[0] || 'Student'}!</h1>
      <div className="stat-grid">
        <DashboardCard title="Total Tasks" value={stats.totalTasks} icon="📚" tone="primary" />
        <DashboardCard title="Pending" value={stats.pendingTasks} icon="⏳" tone="warning" />
        <DashboardCard title="In Progress" value={stats.inProgressTasks} icon="🚧" tone="info" />
        <DashboardCard title="Completed" value={stats.completedTasks} icon="✅" tone="success" />
      </div>

      <section className="card">
        <h3>Task Completion</h3>
        <p>Completed Tasks: {stats.completedTasks}/{stats.totalTasks} &nbsp;|&nbsp; Progress: <strong>{stats.completionPercentage}%</strong></p>
        <div className="progress"><div className="progress-bar" style={{ width: `${stats.completionPercentage}%` }} /></div>
        <p className="muted small">{stats.highPriorityTasks} high priority open · {stats.upcomingTasks} due within 7 days</p>
      </section>

      {tasks.length === 0 ? (
        <div className="card empty">
          <h3>No tasks found.</h3>
          <p>Create your first task to start managing your academic work.</p>
          <Link className="btn btn-primary" to="/tasks/add">+ Add New Task</Link>
        </div>
      ) : (
        <div className="grid-3-cards">
          <List title="Upcoming Deadlines" items={upcoming} empty="No upcoming deadlines." />
          <List title="Recent Tasks" items={recent} empty="No recent tasks." />
          <List title="Priority Tasks" items={high} empty="No high-priority tasks." />
        </div>
      )}
    </>
  );
}
