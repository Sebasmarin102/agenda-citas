import express from 'express';
import { listAppointments } from '../controllers/adminController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/appointments', requireAuth, listAppointments);

export default router;