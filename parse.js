import fs from "fs";
import db from "./db.js";

// Parse a single log line and extract dateTimeCreated, vehicleId, logType, code, and message
// Returns an object with these fields if the line matches the expected format, otherwise null
function parseLogLine(line) {
  const match = line.match(
    /\[(.*?)\] \[VEHICLE_ID:(.*?)] \[(.*?)\] \[CODE:(.*?)\] \[(.*?)\]/,
  );
  if (!match) return null;
  const [, dateTimeCreated, vehicleId, logType, code, message] = match;
  return { dateTimeCreated, vehicleId, logType, code, message };
}

async function importLogs(file = "vehicle_diagnostics_logs.txt") {
  const tableExists = await db.query(`
  SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'vehicle_diagnostics_logs'
  );
`);

  if (tableExists.rows[0].exists) {
    const hasLogs = await db.query(
      `
      SELECT 1 FROM vehicle_diagnostics_logs LIMIT 1
  `,
    );

    if (hasLogs.rows.length > 0) {
      return;
    }
  }

  const lines = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    for (const line of lines) {
      const entry = parseLogLine(line);

      if (entry) {
        await client.query(
          `
          INSERT INTO vehicle_diagnostics_logs
          (dateTimeCreated, vehicleId, logType, code, message)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [
            entry.dateTimeCreated,
            entry.vehicleId,
            entry.logType,
            entry.code,
            entry.message,
          ],
        );
      }
    }

    await client.query("COMMIT");
    console.log("Logs imported successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export { importLogs };
