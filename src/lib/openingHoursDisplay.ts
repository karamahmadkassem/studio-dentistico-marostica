import type { OpeningHour } from '../types/database';

const DAY_NAMES_IT = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const DEFAULT_OPEN = '09:00';
const DEFAULT_WEEKDAY_CLOSE = '19:00';
const DEFAULT_SATURDAY_CLOSE = '13:00';

function defaultCloseForDay(dayOfWeek: number): string {
  return dayOfWeek === 6 ? DEFAULT_SATURDAY_CLOSE : DEFAULT_WEEKDAY_CLOSE;
}

function toDbTime(time: string | null | undefined, fallback: string): string | null {
  if (!time) return `${fallback}:00`;
  const parts = time.split(':');
  const h = parts[0]?.padStart(2, '0') ?? '09';
  const m = (parts[1] ?? '00').padStart(2, '0');
  return `${h}:${m}:00`;
}

function toDisplayTime(time: string | null | undefined, fallback: string): string {
  const raw = time?.slice(0, 5) || fallback;
  const [h, m] = raw.split(':');
  return `${Number(h)}:${m ?? '00'}`;
}

export function normalizeOpeningHour(row: OpeningHour): OpeningHour {
  if (row.is_closed) {
    return { ...row, open_time: null, close_time: null };
  }
  const openFallback = DEFAULT_OPEN;
  const closeFallback = defaultCloseForDay(row.day_of_week);
  return {
    ...row,
    open_time: toDbTime(row.open_time, openFallback),
    close_time: toDbTime(row.close_time, closeFallback),
  };
}

export function normalizeOpeningHours(hours: OpeningHour[]): OpeningHour[] {
  return hours.map(normalizeOpeningHour);
}

function scheduleKey(row: OpeningHour): string {
  if (row.is_closed) return 'closed';
  const open = toDisplayTime(row.open_time, DEFAULT_OPEN);
  const close = toDisplayTime(row.close_time, defaultCloseForDay(row.day_of_week));
  return `${open}|${close}`;
}

export function isDayClosedFromHours(hours: OpeningHour[], date: Date): boolean {
  if (!hours.length) return date.getDay() === 0;
  const row = hours.find((h) => h.day_of_week === date.getDay());
  return row?.is_closed ?? true;
}

export function formatOpeningHoursLines(hours: OpeningHour[], lang: 'it' | 'en'): string[] {
  const dayNames = lang === 'it' ? DAY_NAMES_IT : DAY_NAMES_EN;
  const closedLabel = lang === 'it' ? 'Chiuso' : 'Closed';
  const normalized = normalizeOpeningHours(hours);
  const byDay = new Map(normalized.map((h) => [h.day_of_week, h]));
  const lines: string[] = [];

  let i = 0;
  while (i < DISPLAY_ORDER.length) {
    const startDay = DISPLAY_ORDER[i];
    const row = byDay.get(startDay);
    if (!row) {
      i++;
      continue;
    }

    const key = scheduleKey(row);
    let endDay = startDay;
    let j = i + 1;
    while (j < DISPLAY_ORDER.length) {
      const nextDay = DISPLAY_ORDER[j];
      const nextRow = byDay.get(nextDay);
      if (!nextRow || scheduleKey(nextRow) !== key) break;
      endDay = nextDay;
      j++;
    }

    const startName = dayNames[startDay];
    const endName = dayNames[endDay];
    const rangeLabel = startDay === endDay ? startName : `${startName} – ${endName}`;

    if (key === 'closed') {
      lines.push(`${rangeLabel}: ${closedLabel}`);
    } else {
      const [open, close] = key.split('|');
      lines.push(`${rangeLabel}: ${open} – ${close}`);
    }

    i = j;
  }

  return lines;
}

export { toDbTime, defaultCloseForDay, DEFAULT_OPEN };
