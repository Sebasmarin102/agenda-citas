import { useState } from 'react'
import BookingForm from '../components/BookingForm'
import ConfirmationMessage from '../components/ConfirmationMessage'

function BookingPage() {
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  return (
    <div>
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