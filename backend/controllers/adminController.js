import { getAllAppointmentsByDate } from "../models/appointmentModel.js";

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