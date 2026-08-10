import { useEffect, useState } from 'react'


function App() {
  const [slots, setSlots] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/appointments/available-slots?date=2026-08-14&duration=30`)
      .then((res) => res.json())
      .then((data) => setSlots(data))
  }, [])

  return (
    <div>
      <h1>Horarios disponibles</h1>
      <ul>
        {slots.map((slot) => (
          <li key={slot}>{slot}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
