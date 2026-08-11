function ConfirmationMessage({ appointment }) {
  return (
    <div>
      <h2>¡Cita confirmada!</h2>
      <p>Tu número de cita es #{appointment.id}</p>
    </div>
  );
}

export default ConfirmationMessage;