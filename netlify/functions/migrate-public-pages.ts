import pool from "./db";

export const handler = async () => {
  try {
    console.log("Starting database migration...");

    // Add view_count column to pages table if it doesn't exist
    await pool.query(`
      ALTER TABLE pages
      ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
    `);
    console.log("✓ Added view_count column to pages table");

    // Create contact_submissions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
        name VARCHAR(100),
        email VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✓ Created contact_submissions table");

    // Create index on page_id for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_page_id
      ON contact_submissions(page_id);
    `);
    console.log("✓ Created index on contact_submissions.page_id");

    // Create index on created_at for sorting
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
      ON contact_submissions(created_at DESC);
    `);
    console.log("✓ Created index on contact_submissions.created_at");

    console.log("✓ Database migration completed successfully");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Migration completed successfully" }),
    };
  } catch (error: any) {
    console.error("Migration error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
