import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  return (
    <header className="navbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Toggle menu">☰</button>
      <div className="brand">🎓 Student Task Management</div>
      <div className="nav-user">
        <span className="nav-name">{user?.name}</span>
        <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
