import express from "express";
import Joi from "joi";
import db from "./db.js";
import { importLogs } from "./parse.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Load logs into db on startup
await importLogs();

const schema = Joi.object({
  vehicle: Joi.string(),
  code: Joi.string(),
  from: Joi.date().iso(),
  to: Joi.date().iso(),
});

app.get("/logs", async (req, res) => {
  try {
    const { error, value } = schema.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let sql = "SELECT * FROM vehicle_diagnostics_logs WHERE 1=1";
    const params = [];

    const { rows } = await db.query(sql, params);

    return res.json(rows);
  } catch (err) {
    if (err && (err.isJoi || err.details)) {
      return res
        .status(400)
        .json({
          error: err.details ? err.details.map((d) => d.message) : err.message,
        });
    }
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
