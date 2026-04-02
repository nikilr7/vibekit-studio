import pool from "./db";

export const handler = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL DEFAULT 'Untitled Page',
        content JSONB DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        theme VARCHAR(50) DEFAULT 'minimal',
        slug VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, slug)
      );

      CREATE INDEX IF NOT EXISTS idx_pages_user_id ON pages(user_id);
      CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
      CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at DESC);
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Migration completed" }),
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
