import { createAppointment, getAppointmentsByDate } from "../models/appointmentModel.js";

export const create = async (req, res) => {
    try {
        const { client_name, phone, appointment_date, start_time, end_time } = req.body
        const id = await createAppointment({ client_name, phone, appointment_date, start_time, end_time });
        res.status(201).json({ id })
    } catch (error) {
        res.status(500).json({ error: 'Error creating appointment' });
    }
}

export const listByDate = async (req, res) => {
    try {
        const { date } = req.query
        const appointments = await getAppointmentsByDate(date)
        res.json(appointments)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching appointments' });
    }
}