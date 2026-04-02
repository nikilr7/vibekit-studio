import pool from "./db";

export const handler = async () => {
  try {
    console.log("Starting contact submissions table migration...");

    // Create contact_submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
        name VARCHAR(100),
        email VARCHAR(255),
        message TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✓ Created contact_submissions table");

    // Create indexes for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_page_id
      ON contact_submissions(page_id);
    `);
    console.log("✓ Created index on page_id");

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
      ON contact_submissions(created_at DESC);
    `);
    console.log("✓ Created index on created_at");

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_email
      ON contact_submissions(email);
    `);
    console.log("✓ Created index on email");

    console.log("✓ Contact submissions table migration completed successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Contact submissions table created successfully",
      }),
    };
  } catch (error: any) {
    console.error("Migration error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
