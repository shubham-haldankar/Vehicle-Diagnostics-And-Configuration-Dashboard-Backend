const express = require("express");
const Joi = require("joi");
const db = require("./db");
const { importLogs } = require("./parse");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Load logs into db on startup
// importLogs();

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
