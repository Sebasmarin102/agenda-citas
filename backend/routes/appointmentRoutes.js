import express from 'express'
import { create, listByDate } from '../controllers/appointmentController.js'

const router = express.Router()

router.post('/', create)
router.get('/', listByDate)

export default router