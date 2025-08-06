const pool = require('./db');

async function testMySQLConnection() {
  console.log('🔍 Testing MySQL connection and results display...');
  
  try {
    // Test basic connection
    const [result] = await pool.query('SELECT 1 as test');
    console.log('✅ MySQL connection successful:', result[0]);
    
    // Check database connection details
    const [connectionInfo] = await pool.query('SELECT DATABASE() as current_db, USER() as current_user');
    console.log('📊 Current database:', connectionInfo[0].current_db);
    console.log('👤 Current user:', connectionInfo[0].current_user);
    
    // Check if hireconnect_portal database exists
    const [databases] = await pool.query('SHOW DATABASES LIKE "hireconnect_portal"');
    if (databases.length > 0) {
      console.log('✅ hireconnect_portal database exists');
      
      // Use the database
      await pool.query('USE hireconnect_portal');
      
      // Check tables
      const [tables] = await pool.query('SHOW TABLES');
      console.log('📋 Available tables:', tables.map(table => Object.values(table)[0]));
      
      // Test a simple query to show results
      if (tables.length > 0) {
        console.log('🎯 Testing results display...');
        
        // Check if users table exists
        const [usersTable] = await pool.query('SHOW TABLES LIKE "users"');
        if (usersTable.length > 0) {
          const [users] = await pool.query('SELECT COUNT(*) as total FROM users');
          console.log('👥 Total users:', users[0].total);
          
          // Display sample results
          const [sampleUsers] = await pool.query('SELECT id, email, role, createdAt FROM users LIMIT 3');
          console.log('📝 Sample results:');
          sampleUsers.forEach(user => {
            console.log(`  ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Created: ${user.createdAt}`);
          });
        } else {
          console.log('⚠️ Users table not found');
        }
        
        // Check if candidates table exists
        const [candidatesTable] = await pool.query('SHOW TABLES LIKE "candidates"');
        if (candidatesTable.length > 0) {
          const [candidates] = await pool.query('SELECT COUNT(*) as total FROM candidates');
          console.log('👤 Total candidates:', candidates[0].total);
          
          const [sampleCandidates] = await pool.query('SELECT id, name, email, status FROM candidates LIMIT 3');
          console.log('📝 Sample candidates:');
          sampleCandidates.forEach(candidate => {
            console.log(`  ID: ${candidate.id}, Name: ${candidate.name}, Email: ${candidate.email}, Status: ${candidate.status}`);
          });
        } else {
          console.log('⚠️ Candidates table not found');
        }
        
      } else {
        console.log('⚠️ No tables found in database');
      }
      
    } else {
      console.log('❌ hireconnect_portal database does not exist');
    }
    
    console.log('🎉 MySQL connection test completed successfully!');
    console.log('✅ Results will display in the result grid as shown above');
    
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.error('💡 Please check:');
    console.error('1. MySQL server is running');
    console.error('2. Database credentials are correct');
    console.error('3. Database "hireconnect_portal" exists');
    console.error('4. User has proper permissions');
  } finally {
    process.exit(0);
  }
}

testMySQLConnection();
