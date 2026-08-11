import { useState, useEffect } from 'react';
import { getTodayDateString } from '../utils/date';
import './Agenda.css';

function Agenda() {
    const [date, setDate] = useState(getTodayDateString());
    const [appointments, setAppointments] = useState([]);
    const [blockStart, setBlockStart] = useState('');
    const [blockEnd, setBlockEnd] = useState('');
    const [error, setError] = useState('');

    const loadAppointments = () => {
        fetch(`${import.meta.env.VITE_API_URL}/admin/appointments?date=${date}`, {
            credentials: 'include',
        })
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setAppointments(data));
    };

    useEffect(() => {
        loadAppointments();
    }, [date]);

    const isPast = (appointment) => {
        const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
        return appointmentDateTime < new Date();
    };

    const handleCancel = async (id) => {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/appointments/${id}/cancel`, {
            method: 'PATCH',
            credentials: 'include',
        });
        loadAppointments();
    };

    const handleNoShow = async (id) => {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/appointments/${id}/no-show`, {
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
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            return;
        }

        setBlockStart('');
        setBlockEnd('');
        loadAppointments();
    };

    return (
        <div className="agenda">            
            <h2>Agenda del día</h2>                

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

                        {appointment.status === 'confirmed' && !isPast(appointment) && (
                            <button type="button" onClick={() => handleCancel(appointment.id)}>Cancelar</button>
                        )}
                        {appointment.status === 'confirmed' && isPast(appointment) && (
                            <button type="button" onClick={() => handleNoShow(appointment.id)}>No se presentó</button>
                        )}
                        {appointment.status === 'blocked' && (
                            <button type="button" onClick={() => handleCancel(appointment.id)}>Desbloquear</button>
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

export default Agenda;