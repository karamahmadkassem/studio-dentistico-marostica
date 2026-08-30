import type { OpeningHour } from '../types/database';

export const SLOT_MINUTES = 30;
export const CLINIC_TIMEZONE = 'Europe/Rome';

export const WEEKDAY_HOURS = { open: 9, close: 19 };
export const SATURDAY_HOURS = { open: 9, close: 12 };

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getClinicDateTimeParts(now: Date = new Date()): {
  dateKey: string;
  minutes: number;
} {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: CLINIC_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '00';
  const hour = value('hour') === '24' ? '00' : value('hour');
  return {
    dateKey: `${value('year')}-${value('month')}-${value('day')}`,
    minutes: parseTimeToMinutes(`${hour}:${value('minute')}`),
  };
}

export function getClinicTodayKey(now: Date = new Date()): string {
  return getClinicDateTimeParts(now).dateKey;
}

/** Calendar date for "today" in the clinic timezone (local Date at midnight). */
export function getClinicTodayDate(now: Date = new Date()): Date {
  const { dateKey } = getClinicDateTimeParts(now);
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isPastDate(date: Date): boolean {
  return formatDateKey(date) < getClinicTodayKey();
}

/** True when the slot start time has already passed (clinic local time). */
export function isSlotInPast(date: Date, time: string, now: Date = new Date()): boolean {
  const dateKey = formatDateKey(date);
  const { dateKey: todayKey, minutes: nowMinutes } = getClinicDateTimeParts(now);
  if (dateKey < todayKey) return true;
  if (dateKey > todayKey) return false;
  return parseTimeToMinutes(time.slice(0, 5)) <= nowMinutes;
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
  return buildSlotsBetween(schedule.open * 60, schedule.close * 60);
}

export function getTimeSlotsFromOpeningHours(date: Date, hours: OpeningHour[]): string[] {
  const row = hours.find((h) => h.day_of_week === date.getDay());
  if (!row || row.is_closed || !row.open_time || !row.close_time) return [];
  return buildSlotsBetween(
    parseTimeToMinutes(row.open_time.slice(0, 5)),
    parseTimeToMinutes(row.close_time.slice(0, 5)),
  );
}

function buildSlotsBetween(startMinutes: number, endMinutes: number): string[] {
  const slots: string[] = [];
  let totalMinutes = startMinutes;

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
