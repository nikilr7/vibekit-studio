import pool from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const handler = async (event: any) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const userRes = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userRes.rows.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid password" }),
      };
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=86400`,
      },
      body: JSON.stringify({ message: "Login successful" }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};