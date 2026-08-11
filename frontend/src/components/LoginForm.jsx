import { useState } from "react";

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
        <form onSubmit={handleSubmit}>
            <label>
                Usuario:
                <input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <label>
                Contraseña:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button type="submit">Entrar</button>
            {error && <p>{error}</p>}
        </form>
    )
}

export default LoginForm