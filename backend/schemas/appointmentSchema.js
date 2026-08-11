import { z } from "zod";

export const createAppointmentSchema = z.object({
    client_name: z.string().trim().min(3, 'Name must be at least 3 characters'),
    phone: z.string().regex(/^\d+$/, 'Phone must contain only digits'),
    appointment_date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
})