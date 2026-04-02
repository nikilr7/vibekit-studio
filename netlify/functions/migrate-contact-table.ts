import pool from "./db";

export const handler = async () => {
  try {
    console.log("Starting contact_submissions table migration...");

    // Drop existing table if it exists (to reset schema)
    await pool.query(`DROP TABLE IF EXISTS contact_submissions CASCADE;`);
    console.log("✓ Dropped existing table");

    // Create contact_submissions table with all required columns
    await pool.query(`
      CREATE TABLE contact_submissions (
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
    console.log("✓ Created contact_submissions table with all columns");

    // Create indexes for performance
    await pool.query(`
      CREATE INDEX idx_contact_submissions_page_id
      ON contact_submissions(page_id);
    `);
    console.log("✓ Created index on page_id");

    await pool.query(`
      CREATE INDEX idx_contact_submissions_created_at
      ON contact_submissions(created_at DESC);
    `);
    console.log("✓ Created index on created_at");

    await pool.query(`
      CREATE INDEX idx_contact_submissions_email
      ON contact_submissions(email);
    `);
    console.log("✓ Created index on email");

    await pool.query(`
      CREATE INDEX idx_contact_submissions_ip_address
      ON contact_submissions(ip_address);
    `);
    console.log("✓ Created index on ip_address");

    console.log("✓ Contact submissions table migration completed successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Contact submissions table created successfully with all columns",
      }),
    };
  } catch (error: any) {
    console.error("Migration error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: error.message 
      }),
    };
  }
};
