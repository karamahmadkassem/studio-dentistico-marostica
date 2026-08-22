UPDATE opening_hours SET open_time = '09:00:00', close_time = '19:00:00', updated_at = now()
WHERE day_of_week = 5 AND is_closed = false AND (open_time IS NULL OR close_time IS NULL);

UPDATE opening_hours SET open_time = '09:00:00', close_time = '18:00:00', updated_at = now()
WHERE day_of_week = 6 AND is_closed = false AND open_time IS NULL;
