CREATE TABLE IF NOT EXISTS vehicle_diagnostics_logs (
    id SERIAL PRIMARY KEY,
    dateTimeCreated TEXT NOT NULL,
    vehicleId INTEGER NOT NULL,
    logType TEXT NOT NULL,
    code TEXT NOT NULL,
    message TEXT NOT NULL
);