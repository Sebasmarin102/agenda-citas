import { DateTime } from 'luxon';
import {
  getConfirmedAppointmentsByDate,
  getPendingHourReminders,
  markHourReminderSent,
} from '../models/appointmentModel.js';
import { sendReminderEmail } from './emailService.js';
import { getTodayDateString } from '../utils/date.js';

export const sendDailyDigest = async () => {
  const tomorrow = DateTime.now().setZone('Europe/Madrid').plus({ days: 1 }).toFormat('yyyy-MM-dd');
  const appointments = await getConfirmedAppointmentsByDate(tomorrow);

  if (appointments.length === 0) return;

  const listHtml = appointments
    .map((a) => `<li>${a.start_time} - ${a.end_time}: ${a.client_name}</li>`)
    .join('');

  await sendReminderEmail(
    `Citas de mañana (${tomorrow})`,
    `<p>Tienes ${appointments.length} cita(s) programada(s) para mañana:</p><ul>${listHtml}</ul>`
  );
};

export const sendHourReminders = async () => {
  const today = getTodayDateString();
  const appointments = await getPendingHourReminders(today);
  const now = DateTime.now().setZone('Europe/Madrid');

  for (const appointment of appointments) {
    const start = DateTime.fromFormat(
      `${appointment.appointment_date} ${appointment.start_time}`,
      'yyyy-MM-dd HH:mm:ss',
      { zone: 'Europe/Madrid' }
    );

    const minutesUntilStart = start.diff(now, 'minutes').minutes;

    if (minutesUntilStart > 0 && minutesUntilStart <= 60) {
      await sendReminderEmail(
        'Cita en menos de 1 hora',
        `<p>Tienes una cita a las ${appointment.start_time} con ${appointment.client_name}.</p>`
      );
      await markHourReminderSent(appointment.id);
    }
  }
};

export const sendNewBookingNotification = async (appointment) => {
  await sendReminderEmail(
    'Nueva cita agendada',
    `<p>Acaban de agendar una cita para ${appointment.appointment_date} a las ${appointment.start_time}.</p>
     <p>Cliente: ${appointment.client_name}</p>
     <p>Número: ${appointment.phone}</p>`
  );
};