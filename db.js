import pg from "pg";
import fs from "fs";
import dotenv from "dotenv";

const { Pool } = pg;
dotenv.config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Initialize schema
const schema = fs.readFileSync("schema.sql", "utf8");
console.log("printing", process.env.DATABASE_URL);
db.query(schema)
  .then(() => console.log("Schema initialized"))
  .catch((err) => console.error("Schema initialization error:", err));

export default db;
