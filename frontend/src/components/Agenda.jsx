import { useState, useEffect } from 'react';
import { getTodayDateString } from '../utils/date';
import './Agenda.css'

function Agenda({ onLogout }) {
    const [date, setDate] = useState(getTodayDateString());
    const [appointments, setAppointments] = useState([]);
    const [blockStart, setBlockStart] = useState('');
    const [blockEnd, setBlockEnd] = useState('');
    const [error, setError] = useState('');

    const loadAppointments = () => {
        fetch(`${import.meta.env.VITE_API_URL}/admin/appointments?date=${date}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setAppointments(data));
    };

    useEffect(() => {
        loadAppointments();
    }, [date]);

    const handleCancel = async (id) => {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/appointments/${id}/cancel`, {
            method: 'PATCH',
            credentials: 'include',
        });
        loadAppointments();
    };

    const handleBlock = async (e) => {
        e.preventDefault();
        setError('');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/appointments/block`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                appointment_date: date,
                start_time: `${blockStart}:00`,
                end_time: `${blockEnd}:00`,
            })
        })

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            return;
        }

        setBlockStart('');
        setBlockEnd('');
        loadAppointments();
    }

    const handleLogout = async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        onLogout();
    };

    return (
        <div className="agenda">
            <div className="agenda-header">
                <h2>Agenda del día</h2>
                <button type="button" onClick={handleLogout}>Cerrar sesión</button>
            </div>
            

            <div className="field">
                <label>
                    Fecha:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>
            </div>

            <ul className="appointment-list">
                {appointments.map((appointment) => (
                    <li key={appointment.id} className={`appointment-card status-${appointment.status}`}>
                        <span className="time-range">{appointment.start_time} - {appointment.end_time}</span>
                        <span className="client-name">{appointment.client_name ?? 'Bloqueado'}</span>
                        <span className="status-badge">{appointment.status}</span>
                        {(appointment.status === 'confirmed' || appointment.status === 'blocked') && (
                            <button type="button" onClick={() => handleCancel(appointment.id)}>
                                {appointment.status === 'blocked' ? 'Desbloquear' : 'Cancelar'}
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleBlock} className="block-form">
                <h3>Bloquear horario</h3>
                <div className="time-fields">
                    <label>
                        Desde:
                        <input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} required />
                    </label>
                    <label>
                        Hasta:
                        <input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} required />
                    </label>
                </div>
                <button type="submit">Bloquear</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );

}

export default Agenda