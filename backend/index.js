import express from 'express'
import pool from './config/db.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

import cronRoutes from './routes/cronRoutes.js';
import session from 'express-session'
import cors from 'cors'

const app = express()
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  },
}));

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes)
app.use('/cron', cronRoutes);

app.get('/', (req, res) => {
    res.send('Servidor funcionando')
})

app.get('/test-db', async (req, res) => {
    const [rows] = await pool.query('SELECT NOW() AS ahora')
    res.json(rows)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})