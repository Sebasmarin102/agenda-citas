import express from 'express'
import pool from './config/db.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import cors from 'cors'

const app = express()
app.use(express.json());
app.use(cors());

app.use('/appointments', appointmentRoutes)

app.get('/', (req, res) => {
    res.send('Servidor funcionando')
})

app.get('/test-db', async (req, res) => {
    const [rows] = await pool.query('SELECT NOW() AS ahora')
    res.json(rows)
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})