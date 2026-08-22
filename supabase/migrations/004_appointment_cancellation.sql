-- Allow rebooking cancelled slots; store optional cancellation reason
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_appointment_date_appointment_time_key;

CREATE UNIQUE INDEX IF NOT EXISTS appointments_active_slot_unique
  ON appointments (appointment_date, appointment_time)
  WHERE status <> 'cancelled';
