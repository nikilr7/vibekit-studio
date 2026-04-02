import "dotenv/config";
import { Client } from "pg";

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Users table created successfully");
    await client.end();
  } catch (error) {
    console.error("✗ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
