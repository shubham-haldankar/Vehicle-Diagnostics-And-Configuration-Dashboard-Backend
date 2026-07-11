const express = require("express");
const Joi = require("joi");
const db = require("./db");
const { importLogs } = require("./parse");

const app = express();
const PORT = 3000;

// Load logs into db on startup
// importLogs();
