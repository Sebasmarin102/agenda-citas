import express from 'express';
import { listAppointments, cancelAppointmentHandler, blockSlot, markNoShowHandler } from '../controllers/adminController.js';
import { getDashboard } from '../controllers/statsController.js'
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/appointments', requireAuth, listAppointments);
router.patch('/appointments/:id/cancel', requireAuth, cancelAppointmentHandler)
router.post('/appointments/block', requireAuth, blockSlot)
router.patch('/appointments/:id/no-show', requireAuth, markNoShowHandler);
router.get('/dashboard', requireAuth, getDashboard);

export default router;