import { z } from "zod";
import { getTodayDateString } from "../utils/date.js";
import { isWithinBusinessHours } from "../services/availabilityService.js";

const isNotPastDate = (date) => date >= getTodayDateString()

export const createAppointmentSchema = z.object({
  client_name: z.string().trim().min(3, 'Name must be at least 3 characters'),
  phone: z.string().regex(/^\d+$/, 'Phone must contain only digits'),
  appointment_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
})
  .refine((data) => data.start_time < data.end_time, {
    message: 'Start time must be before end time',
    path: ['start_time'],
  })
  .refine((data) => isNotPastDate(data.appointment_date), {
    message: 'Cannot book a date in the past',
    path: ['appointment_date'],
  })
  .refine((data) => isWithinBusinessHours(data.appointment_date, data.start_time, data.end_time), {
    message: 'Appointment must be within business hours (Mon-Fri, 6:30pm-9:30pm)',
    path: ['start_time'],
  });

export const blockSlotSchema = z.object({
  appointment_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
})
  .refine((data) => data.start_time < data.end_time, {
    message: 'Start time must be before end time',
    path: ['start_time'],
  })
  .refine((data) => isNotPastDate(data.appointment_date), {
    message: 'Cannot block a date in the past',
    path: ['appointment_date'],
  })
  .refine((data) => isWithinBusinessHours(data.appointment_date, data.start_time, data.end_time), {
    message: 'Blocked slot must be within business hours (Mon-Fri, 6:30pm-9:30pm)',
    path: ['start_time'],
  });

