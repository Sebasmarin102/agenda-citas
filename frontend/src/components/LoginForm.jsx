import { useState } from "react";
import './LoginForm.css'

function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const data = await response.json();
            setError(data.error);
            return;
        }

        onLoginSuccess();
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Panel de administración</h2>
            <div className="field">
                <label>
                    Usuario:
                    <input value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
            </div>
            <div className="field">
                <label>
                    Contraseña:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
            </div>
            <button type="submit">Entrar</button>
            {error && <p className="error-message">{error}</p>}
        </form>
    )
}

export default LoginForm