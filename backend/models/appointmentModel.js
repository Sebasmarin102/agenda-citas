import pool from "../config/db.js";

export const createAppointment = async ({ client_name, phone, appointment_date, start_time, end_time }) => {
    const [result] = await pool.query(
        'INSERT INTO appointments (client_name, phone, appointment_date, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
        [client_name, phone, appointment_date, start_time, end_time]
    )
    return result.insertId;
}

export const getAppointmentsByDate = async (appointment_date) => {
    const [rows] = await pool.query(
        'SELECT * FROM appointments WHERE appointment_date = ? AND status = "confirmed" ORDER BY start_time',
        [appointment_date]
    );
    return rows
}

export const hasOverlappingAppointment = async ({ appointment_date, start_time, end_time }) => {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count FROM appointments
        WHERE appointment_date = ?
        AND status = 'confirmed'
        AND start_time < ?
        AND end_time > ?`,
        [appointment_date, end_time, start_time]
    )
    return rows[0].count > 0
}

export const getAllAppointmentsByDate = async (appointment_date) => {
  const [rows] = await pool.query(
    'SELECT * FROM appointments WHERE appointment_date = ? ORDER BY start_time',
    [appointment_date]
  );
  return rows;
};