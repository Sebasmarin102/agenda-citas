import { createAppointment, getAppointmentsByDate, hasOverlappingAppointment } from "../models/appointmentModel.js";
import { getAvailableSlots } from "../services/availabilityService.js";

export const create = async (req, res) => {
    try {
        const { client_name, phone, appointment_date, start_time, end_time } = req.body
        const overlaps = await hasOverlappingAppointment({ appointment_date, start_time, end_time });

        if (overlaps) {
            return res.status(409).json({ error: 'Time slot already booked' });
        }

        const id = await createAppointment({ client_name, phone, appointment_date, start_time, end_time });
        res.status(201).json({ id });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error creating appointment' });
    }
}

export const listByDate = async (req, res) => {
    try {
        const { date } = req.query
        const appointments = await getAppointmentsByDate(date)
        res.json(appointments)
    } catch (error) {        
        res.status(500).json({ error: 'Error fetching appointments' });
    }
}

export const availableSlots = async (req, res) => {
    try {
        const { date, duration } = req.query;
        const slots = await getAvailableSlots(date, Number(duration));
        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching available slots' });
    }
}