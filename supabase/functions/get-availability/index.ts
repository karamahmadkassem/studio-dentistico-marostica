import { handleOptions, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import {
  formatDateKey,
  generateSlotsForDay,
  type OpeningHourRow,
} from '../_shared/slots.ts';

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'GET') return errorResponse('Method not allowed', 405);

  try {
    const url = new URL(req.url);
    const dateStr = url.searchParams.get('date');
    const fromStr = url.searchParams.get('from');
    const toStr = url.searchParams.get('to');

    const supabase = getServiceClient();
    const { data: hours } = await supabase.from('opening_hours').select('*').order('day_of_week');
    const openingHours = (hours ?? []) as OpeningHourRow[];

    if (dateStr) {
      const date = new Date(dateStr + 'T12:00:00');
      const dayOfWeek = date.getDay();
      const allSlots = generateSlotsForDay(dayOfWeek, openingHours);

      const { data: booked } = await supabase
        .from('appointments')
        .select('appointment_time, status')
        .eq('appointment_date', dateStr)
        .in('status', ['pending', 'accepted', 'review_sent']);

      const bookedTimes = new Set(
        (booked ?? []).map((b) => String(b.appointment_time).slice(0, 5)),
      );

      const today = formatDateKey(new Date());
      const isPast = dateStr < today;
      const isClosed = openingHours.find((h) => h.day_of_week === dayOfWeek)?.is_closed ?? true;

      return jsonResponse({
        date: dateStr,
        isClosed: isClosed || isPast,
        slots: allSlots.map((time) => ({
          time,
          available: !isPast && !isClosed && !bookedTimes.has(time),
        })),
      });
    }

    if (fromStr && toStr) {
      const result: Record<string, { isClosed: boolean; booked: string[] }> = {};
      const start = new Date(fromStr + 'T12:00:00');
      const end = new Date(toStr + 'T12:00:00');
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = formatDateKey(d);
        const dow = d.getDay();
        const row = openingHours.find((h) => h.day_of_week === dow);
        result[key] = {
          isClosed: row?.is_closed ?? true,
          booked: [],
        };
      }

      const { data: appts } = await supabase
        .from('appointments')
        .select('appointment_date, appointment_time')
        .gte('appointment_date', fromStr)
        .lte('appointment_date', toStr)
        .in('status', ['pending', 'accepted', 'review_sent']);

      for (const a of appts ?? []) {
        const key = a.appointment_date as string;
        if (result[key]) {
          result[key].booked.push(String(a.appointment_time).slice(0, 5));
        }
      }

      return jsonResponse({ days: result, openingHours });
    }

    return errorResponse('Provide date or from/to params', 400);
  } catch (e) {
    console.error(e);
    return errorResponse('Failed to get availability', 500);
  }
});
