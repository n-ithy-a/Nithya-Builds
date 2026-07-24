// backend/db.js

const { Pool } = require("pg");
require("dotenv").config();


// console.log("DATABASE_URL:", process.env.DATABASE_URL);
// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Required for hosted PostgreSQL services like Supabase
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test the database connection
// Test connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to Supabase PostgreSQL");
    client.release();
  } catch (err) {
    console.error("❌ Failed to connect to Supabase");
    console.error(err);
  }
})();
module.exports = pool;