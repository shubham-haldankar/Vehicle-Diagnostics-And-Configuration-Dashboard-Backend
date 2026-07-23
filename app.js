import express from "express";
import Joi from "joi";
import db from "./db.js";
import { importLogs } from "./parse.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

// Load logs into db on startup
await importLogs();

const schema = Joi.object({
  vehicleid: Joi.string(),
  code: Joi.string(),
  from: Joi.date().iso(),
  to: Joi.date().iso(),
});

app.get("/logs", async (req, res) => {
  try {
    const { error, value } = schema.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let sql = `SELECT id, datetimecreated AS "dateTimeCreated", vehicleid AS "vehicleId",
    logtype AS "type", code, message FROM vehicle_diagnostics_logs WHERE 1=1`;
    const params = [];
    let i = 1;

    if (value.vehicleid) {
      sql += ` AND "vehicleId" = $${i++}`;
      params.push(value.vehicleid);
    }

    if (value.code) {
      sql += ` AND "code" = $${i++}`;
      params.push(value.code);
    }

    if (value.from) {
      sql += ` AND "dateTimeCreated" >= $${i++}`;
      params.push(value.from.toISOString());
    }

    if (value.to) {
      sql += ` AND "dateTimeCreated" <= $${i++}`;
      params.push(value.to.toISOString());
    }
    const { rows } = await db.query(sql, params);
    return res.json(rows);
  } catch (err) {
    if (err && (err.isJoi || err.details)) {
      return res.status(400).json({
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
