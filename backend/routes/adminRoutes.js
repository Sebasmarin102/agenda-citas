import express from 'express';
import { listAppointments, cancelAppointmentHandler } from '../controllers/adminController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/appointments', requireAuth, listAppointments);
router.patch('/appointments/:id/cancel', requireAuth, cancelAppointmentHandler)

export default router;