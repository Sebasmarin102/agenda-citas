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
        'SELECT * FROM appointments WHERE appointment_date = ? AND status IN ("confirmed", "blocked") ORDER BY start_time',
        [appointment_date]
    );
    return rows
}

export const hasOverlappingAppointment = async ({ appointment_date, start_time, end_time }) => {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count FROM appointments
        WHERE appointment_date = ?
        AND status IN ("confirmed", "blocked")
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

export const cancelAppointment = async (id) => {
    await pool.query(
        'UPDATE appointments SET status = ? WHERE id = ?',
        ['cancelled', id]
    )
}

export const createBlockedSlot = async ({ appointment_date, start_time, end_time }) => {
    const [result] = await pool.query(
        'INSERT INTO appointments (appointment_date, start_time, end_time, status) VALUES (?, ?, ?, ?)',
        [appointment_date, start_time, end_time, 'blocked']
    )
    return result.insertId;
}

export const getConfirmedAppointmentsByDate = async (appointment_date) => {
  const [rows] = await pool.query(
    'SELECT * FROM appointments WHERE appointment_date = ? AND status = ? ORDER BY start_time',
    [appointment_date, 'confirmed']
  );
  return rows;
};

export const getPendingHourReminders = async (appointment_date) => {
  const [rows] = await pool.query(
    'SELECT * FROM appointments WHERE appointment_date = ? AND status = ? AND reminder_1h_sent = FALSE',
    [appointment_date, 'confirmed']
  );
  return rows;
};

export const markHourReminderSent = async (id) => {
  await pool.query('UPDATE appointments SET reminder_1h_sent = TRUE WHERE id = ?', [id]);
};