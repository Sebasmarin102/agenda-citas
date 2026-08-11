import { getAllAppointmentsByDate, cancelAppointment } from "../models/appointmentModel.js";

export const listAppointments = async (req, res) => {
  try {
    const { date } = req.query;
    const appointments = await getAllAppointmentsByDate(date);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
};

export const cancelAppointmentHandler = async (req, res) => {
    try {
        const { id } = req.params
        await cancelAppointment(id)
        res.json({ message: 'Appointment cancelled' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error cancelling appointment' });
    }
}