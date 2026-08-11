import cron from 'node-cron';
import { sendDailyDigest, sendHourReminders } from './services/reminderService.js';

export const startCronJobs = () => {
  cron.schedule('0 8 * * *', sendDailyDigest, { timezone: 'Europe/Madrid' });
  cron.schedule('*/15 * * * *', sendHourReminders, { timezone: 'Europe/Madrid' });
};