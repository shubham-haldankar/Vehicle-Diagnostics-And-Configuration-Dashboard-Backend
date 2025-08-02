IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='dbo.vehicle_diagnostics_logs' AND xtype='U')
BEGIN
CREATE TABLE vehicle_diagnostics_logs (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  dateTimeCreated TIMESTAMP NOT NULL,
  vehicleId SMALLINT NOT NULL,
  logType NVARCHAR(50) NOT NULL,
  code NVARCHAR(50) NOT NULL,
  message NVARCHAR(100) NOT NULL
);
END