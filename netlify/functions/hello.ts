import client from "./db";

export const handler = async () => {
  try {
    const res = await client.query("SELECT NOW()");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "DB connected 🚀",
        time: res.rows[0],
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "DB connection failed",
      }),
    };
  }
};