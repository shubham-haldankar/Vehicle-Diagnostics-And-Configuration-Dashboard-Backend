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
  const insert = db.prepare(`
    INSERT INTO vehicle_diagnostics_logs (dateTimeCreated, vehicleId, logType, code, message)
    VALUES (@dateTimeCreated, @vehicleId, @logType, @code, @message)
  `);

  const checkExists = db.prepare(`
    SELECT 1 FROM vehicle_diagnostics_logs WHERE dateTimeCreated = ? AND vehicleId = ? AND code = ?
  `);

  const transaction = db.transaction(() => {
    for (const line of lines) {
      const entry = parseLogLine(line);
      if (entry && !checkExists.get(entry.dateTimeCreated, entry.vehicleId, entry.code)) {
        insert.run(entry);
      }
    }
  });

  transaction();
}

module.exports = { importLogs };