import mysql from 'mysql2/promise'
import dontev from 'dotenv'

dontev.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: ['DATE'],
    ssl: {
    rejectUnauthorized: false,
    },
});

export default pool