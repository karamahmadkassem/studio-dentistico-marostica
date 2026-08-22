export const SLOT_MINUTES = 30;

export interface OpeningHourRow {
  day_of_week: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function formatMinutesToTime(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function generateSlotsForDay(
  dayOfWeek: number,
  hours: OpeningHourRow[],
): string[] {
  const row = hours.find((h) => h.day_of_week === dayOfWeek);
  if (!row || row.is_closed || !row.open_time || !row.close_time) return [];
  const slots: string[] = [];
  let cur = parseTimeToMinutes(row.open_time.slice(0, 5));
  const end = parseTimeToMinutes(row.close_time.slice(0, 5));
  while (cur + SLOT_MINUTES <= end) {
    slots.push(formatMinutesToTime(cur));
    cur += SLOT_MINUTES;
  }
  return slots;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
