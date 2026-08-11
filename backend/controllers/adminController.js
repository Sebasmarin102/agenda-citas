import { 
    getAllAppointmentsByDate, 
    cancelAppointment, 
    hasOverlappingAppointment, 
    createBlockedSlot ,
    markNoShow,
    getAppointmentById
} from "../models/appointmentModel.js";
import { isInThePast } from '../services/availabilityService.js';

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

export const markNoShowHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentById(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (!isInThePast(appointment.appointment_date, appointment.start_time)) {
      return res.status(400).json({ error: 'Cannot mark a future appointment as no-show' });
    }

    await markNoShow(id);
    res.json({ message: 'Marked as no-show' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error marking no-show' });
  }
};
