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

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
