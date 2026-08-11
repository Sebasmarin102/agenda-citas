import { getAppointmentsByDate } from "../models/appointmentModel.js";

export const OPEN_TIME = '18:30:00'
export const CLOSE_TIME = '21:30:00'
const SLOT_STEP = 15

export const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}

const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
}

export const getAvailableSlots = async (date, durationMinutes) => {
    const [year, month, day] = date.split('-').map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return [];
    }

    const bookedAppointments = await getAppointmentsByDate(date);
    const openMinutes = timeToMinutes(OPEN_TIME);
    const closeMinutes = timeToMinutes(CLOSE_TIME);
    const availableSlots = [];    

    for (let start = openMinutes; start + durationMinutes <= closeMinutes; start += SLOT_STEP) {
        const end = start + durationMinutes;

        const overlaps = bookedAppointments.some((appointment) => {
            const bookedStart = timeToMinutes(appointment.start_time)
            const bookedEnd = timeToMinutes(appointment.end_time)
            return bookedStart < end && start < bookedEnd
        });

        if (!overlaps) {
            availableSlots.push(minutesToTime(start))
        }
    }

    return availableSlots;  
}

export const isWithinBusinessHours = (date, start_time, end_time) => {
    const [year, month, day] = date.split('-').map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
    }

    const start = timeToMinutes(start_time);
    const end = timeToMinutes(end_time);
    const open = timeToMinutes(OPEN_TIME);
    const close = timeToMinutes(CLOSE_TIME);

    return start >= open && end <= close;
}