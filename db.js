const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('./logs.db');

// Initialize schema
const schema = fs.readFileSync('schema.sql', 'utf8');
db.exec(schema);

module.exports = db;