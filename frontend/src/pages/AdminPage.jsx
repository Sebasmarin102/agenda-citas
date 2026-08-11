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
            })
    }, [])

    if (checkingAuth) return <p>Cargando...</p>;

    if (!isAuthenticated) {
        return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <Agenda />
    )
}

export default AdminPage;