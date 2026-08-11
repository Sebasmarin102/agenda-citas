import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import Agenda from '../components/Agenda';
import Dashboard from '../components/Dashboard';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [view, setView] = useState('agenda');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: 'include' })
      .then((res) => {
        setIsAuthenticated(res.ok);
        setCheckingAuth(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
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