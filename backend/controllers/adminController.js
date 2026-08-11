import { getAllAppointmentsByDate, cancelAppointment } from "../models/appointmentModel.js";
import { createBlockedSlot, hasOverlappingAppointment } from "../models/appointmentModel.js";

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

export const blockSlot = async (req, res) => {
    try {
        const parseResult = blockSlotSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({ error: parseResult.error.issues[0].message });
        }
        
        const { appointment_date, start_time, end_time } = req.body

        const overlaps = await hasOverlappingAppointment({ appointment_date, start_time, end_time })
        if (overlaps) {
            return res.status(409).json({ error: 'Time slot already booked or blocked' });
        }

        const id = await createBlockedSlot({ appointment_date, start_time, end_time });
        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error blocking slot' });
    }
}

