import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import Agenda from '../components/Agenda';
import Dashboard from '../components/Dashboard';
import { getAuthHeaders } from '../utils/auth';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [view, setView] = useState('agenda');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: getAuthHeaders(),
    }).then((res) => {
      setIsAuthenticated(res.ok);
      setCheckingAuth(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (checkingAuth) return <div className="page"><p>Cargando...</p></div>;

  if (!isAuthenticated) {
    return (
      <div className="page">
        <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="page">
      <nav className="admin-nav">
        <button type="button" onClick={() => setView('agenda')}>Agenda</button>
        <button type="button" onClick={() => setView('dashboard')}>Dashboard</button>
        <button type="button" onClick={handleLogout}>Cerrar sesión</button>
      </nav>

      {view === 'agenda' ? <Agenda /> : <Dashboard />}
    </div>
  );
}

export default AdminPage;