import { useState } from 'react'
import BookingForm from '../components/BookingForm'
import ConfirmationMessage from '../components/ConfirmationMessage'
import '../index.css';

function BookingPage() {
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  return (
    <div className="page">
      <h1>Reserva tu cita</h1>
      {confirmedAppointment ? (
        <ConfirmationMessage appointment={confirmedAppointment} />
      ) : (
        <BookingForm onSuccess={setConfirmedAppointment}/>
      )}      
    </div>
  )
}

export default BookingPage