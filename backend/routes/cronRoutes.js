import express from 'express';
import { sendDailyDigest, sendHourReminders } from '../services/reminderService.js';
import { requireCronSecret } from '../middleware/cronMiddleware.js';

const router = express.Router();

router.get('/daily-digest', requireCronSecret, async (req, res) => {
  await sendDailyDigest();
  res.json({ message: 'Daily digest checked' });
});

router.get('/hour-reminders', requireCronSecret, async (req, res) => {
  await sendHourReminders();
  res.json({ message: 'Hour reminders checked' });
});

export default router;