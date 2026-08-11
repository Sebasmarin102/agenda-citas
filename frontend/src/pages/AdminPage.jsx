import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import Agenda from '../components/Agenda';

function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: 'include' })
            .then((res) => {
                setIsAuthenticated(res.ok);
                setCheckingAuth(false);
            });
    }, []);

    return (
        <div className="page">
            {checkingAuth ? (
                <p>Cargando...</p>
            ) : isAuthenticated ? (
                <Agenda onLogout={() => setIsAuthenticated(false)} />
            ) : (
                <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
            )}
        </div>
    );
}

export default AdminPage;