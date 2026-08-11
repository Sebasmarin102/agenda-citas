import { useState, useEffect } from 'react';
import { getTodayDateString } from '../utils/date';

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

    return (
        <div>
            <label>
                Fecha:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>

            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment.id}>
                        {appointment.start_time} - {appointment.end_time} | {appointment.client_name ?? 'Bloqueado'} | {appointment.status}
                        {(appointment.status === 'confirmed' || appointment.status === 'blocked') && (
                            <button type="button" onClick={() => handleCancel(appointment.id)}>
                                {appointment.status === 'blocked' ? 'Desbloquear' : 'Cancelar'}
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleBlock}>
                <h3>Bloquear horario</h3>
                <label>
                    Desde:
                    <input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} required />
                </label>
                <label>
                    Hasta:
                    <input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} required />
                </label>
                <button type="submit">Bloquear</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );

}

export default Agenda