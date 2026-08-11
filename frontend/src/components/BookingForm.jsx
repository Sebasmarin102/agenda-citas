import { useState, useEffect } from 'react';
import { getTodayDateString } from '../utils/date';

const DURATIONS = [15, 30, 45, 60];

function BookingForm({ onSuccess }) {
  const [date, setDate] = useState(getTodayDateString());
  const [duration, setDuration] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!date || !duration) return;

    fetch(`${import.meta.env.VITE_API_URL}/appointments/available-slots?date=${date}&duration=${duration}`)
      .then((res) => res.json())
      .then((data) => setAvailableSlots(data));

    setSelectedSlot(null);
  }, [date, duration]);

  const getEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const endMinutes = String(totalMinutes % 60).padStart(2, '0');
    return `${endHours}:${endMinutes}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: clientName,
        phone,
        appointment_date: date,
        start_time: selectedSlot,
        end_time: getEndTime(selectedSlot),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    onSuccess(data);
  };

  return (
    <div>
      <label>
        Fecha:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <div>
        {DURATIONS.map((min) => (
          <button key={min} type="button" onClick={() => setDuration(min)} disabled={duration === min}>
            {min} min
          </button>
        ))}
      </div>

      {date && duration && (
        availableSlots.length > 0 ? (
          <div>
            {availableSlots.map((slot) => (
              <button key={slot} type="button" onClick={() => setSelectedSlot(slot)} disabled={selectedSlot === slot}>
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <p>No hay horarios disponibles este día.</p>
        )
      )}

      {selectedSlot && (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </label>
          <label>
            Celular:
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
          <button type="submit">Confirmar cita</button>
          {error && <p>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default BookingForm;