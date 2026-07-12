import fs from "fs";
import db from "./db.js";

function parseLogLine(line) {
  const match = line.match(
    /\[(.*?)\] \[VEHICLE_ID:(.*?)] \[(.*?)\] \[CODE:(.*?)\] \[(.*?)\]/,
  );
  if (!match) return null;
  const [, dateTimeCreated, vehicleId, logType, code, message] = match;
  return { dateTimeCreated, vehicleId, logType, code, message };
}

async function importLogs(file = "vehicle_diagnostics_logs.txt") {
  const hasLogs = await db.query(
    `
      SELECT 1 FROM vehicle_diagnostics_logs LIMIT 1
  `,
  );

  if (hasLogs.rows.length > 0) {
    return;
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
