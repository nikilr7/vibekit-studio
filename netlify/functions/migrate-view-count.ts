import pool from "./db";

export const handler = async () => {
  try {
    await pool.query(`
      ALTER TABLE pages
      ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
    `);

    console.log("✓ view_count column added to pages table");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Migration completed" }),
    };
  } catch (error: any) {
    console.error("✗ Migration failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
