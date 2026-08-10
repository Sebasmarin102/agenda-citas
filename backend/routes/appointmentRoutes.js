import express from 'express'
import { create, listByDate, availableSlots } from '../controllers/appointmentController.js'

const router = express.Router()

router.post('/', create)
router.get('/', listByDate)
router.get('/available-slots', availableSlots);

export default router