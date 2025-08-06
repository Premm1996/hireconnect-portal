import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Tbdam@583225',
  database: process.env.DB_NAME || 'hireconnect_portal',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

export default pool;

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ MySQL connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.error('Please check:');
    console.error('1. MySQL server is running');
    console.error('2. Database credentials are correct');
    console.error('3. Database "hireconnect_portal" exists');
  }
}

testConnection();
