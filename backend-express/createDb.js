const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '' });
    await connection.query("CREATE DATABASE IF NOT EXISTS \`repo_stiesnu\`;");
    console.log("Database initialized successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to connect to MySQL (make sure XAMPP/MySQL is running!):", err.message);
    process.exit(1);
  }
}
createDatabase();
