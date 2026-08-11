import pool from '../config/db.js';

export const getBusiestHours = async () => {
  const [rows] = await pool.query(
    `SELECT start_time, COUNT(*) AS count
     FROM appointments
     WHERE status IN ('confirmed', 'no_show')
     GROUP BY start_time
     ORDER BY count DESC
     LIMIT 10`
  );
  return rows;
};

export const getBusiestDays = async () => {
  const [rows] = await pool.query(
    `SELECT DAYNAME(appointment_date) AS day, COUNT(*) AS count
     FROM appointments
     WHERE status IN ('confirmed', 'no_show')
     GROUP BY DAYNAME(appointment_date)
     ORDER BY count DESC`
  );
  return rows;
};

export const getFrequentClients = async () => {
  const [rows] = await pool.query(
    `SELECT phone, MAX(client_name) AS client_name, COUNT(*) AS visit_count
     FROM appointments
     WHERE status IN ('confirmed', 'no_show')
     GROUP BY phone
     ORDER BY visit_count DESC
     LIMIT 10`
  );
  return rows;
};

export const getNoShowRate = async () => {
  const [rows] = await pool.query(
    `SELECT
       SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) AS no_shows,
       SUM(CASE WHEN status IN ('confirmed', 'no_show') THEN 1 ELSE 0 END) AS total
     FROM appointments`
  );
  return rows[0];
};