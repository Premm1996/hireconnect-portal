// backend/db.ts
import { createPool } from 'mysql2/promise';

// Create a MySQL connection pool using hardcoded credentials
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'Tbdam@583225',
  database: 'hireconnect_portal',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

export default pool;

// Optional: Test the connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ MySQL connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
  }
}

// Test connection immediately
testConnection();
