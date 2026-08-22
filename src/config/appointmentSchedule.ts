export const SLOT_MINUTES = 30;

export const WEEKDAY_HOURS = { open: 9, close: 19 };
export const SATURDAY_HOURS = { open: 9, close: 13 };

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isPastDate(date: Date): boolean {
  return startOfDay(date).getTime() < startOfDay(new Date()).getTime();
}

/** True when the slot start time has already passed (browser local time). */
export function isSlotInPast(date: Date, time: string): boolean {
  const dateKey = formatDateKey(date);
  const todayKey = formatDateKey(new Date());
  if (dateKey < todayKey) return true;
  if (dateKey > todayKey) return false;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return parseTimeToMinutes(time) <= nowMinutes;
}

export function isDayOpen(date: Date): boolean {
  return date.getDay() !== 0;
}

export function getDaySchedule(date: Date): { open: number; close: number } | null {
  if (!isDayOpen(date)) return null;
  if (date.getDay() === 6) return SATURDAY_HOURS;
  return WEEKDAY_HOURS;
}

export function formatTimeLabel(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function formatMinutesToTime(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return formatTimeLabel(h, m);
}

export function getTimeSlotsForDate(date: Date): string[] {
  const schedule = getDaySchedule(date);
  if (!schedule) return [];

  const slots: string[] = [];
  let totalMinutes = schedule.open * 60;
  const endMinutes = schedule.close * 60;

  while (totalMinutes + SLOT_MINUTES <= endMinutes) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    slots.push(formatTimeLabel(hour, minute));
    totalMinutes += SLOT_MINUTES;
  }

  return slots;
}

export function getBookedSlotsForDate(date: Date): Set<string> {
  const dateKey = formatDateKey(date);
  const slots = getTimeSlotsForDate(date);
  const seed = dateKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return new Set(
    slots.filter((_, index) => (seed + index * 7) % 5 === 0 || (seed + index * 3) % 11 === 0),
  );
}

export function buildMonthGrid(viewDate: Date): (Date | null)[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const mondayBasedOffset = (firstDay.getDay() + 6) % 7;
  const cells: (Date | null)[] = Array.from({ length: mondayBasedOffset }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}
