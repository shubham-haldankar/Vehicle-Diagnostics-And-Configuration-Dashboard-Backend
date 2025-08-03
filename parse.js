const fs = require('fs');
const db = require('./db');

function parseLogLine(line) {
  const match = line.match(/\[(.*?)\] \[VEHICLE_ID:(.*?)] \[(.*?)\] \[CODE:(.*?)\] \[(.*?)\]/);
  if (!match) return null;
  const [ , dateTimeCreated, vehicleId, logType, code, message] = match
  return { dateTimeCreated, vehicleId, logType, code, message };
}

function importLogs(file = 'vehicle_diagnostics_logs.txt') {
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);

  const transaction = db.transaction(() => {
    for (const line of lines) {
      const entry = parseLogLine(line);
      console.log(entry)
    }
  });

  transaction();
}

importLogs()

module.exports = { importLogs };