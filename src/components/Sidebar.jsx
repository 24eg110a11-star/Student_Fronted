import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/tasks', label: 'My Tasks', icon: '📋', end: true },
  { to: '/tasks/add', label: 'Add Task', icon: '➕' },
  { to: '/tasks/upcoming', label: 'Upcoming', icon: '⏰' },
  { to: '/tasks/completed', label: 'Completed', icon: '✅' },
  { to: '/profile', label: 'Profile', icon: '👤' }
];

export default function Sidebar({ open, onNavigate }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} onClick={onNavigate}
          className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <span>{l.icon}</span> {l.label}
        </NavLink>
      ))}
      <button className="side-link side-logout" onClick={() => { logout(); navigate('/login'); }}>
        <span>🚪</span> Logout
      </button>
    </aside>
  );
}
