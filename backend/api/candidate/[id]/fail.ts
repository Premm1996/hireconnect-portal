// backend/db.ts
import 'dotenv/config';
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Tbdam@583225',
  database: process.env.MYSQL_DATABASE || 'student_portal',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

export default pool;
