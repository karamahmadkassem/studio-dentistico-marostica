import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import RequiredMark from './RequiredMark';
import { fetchAvailability, fetchOpeningHoursPublic } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import { isDayClosedFromHours } from '../lib/openingHoursDisplay';
import {
  buildMonthGrid,
  formatDateKey,
  getBookedSlotsForDate,
  getTimeSlotsForDate,
  isDayOpen,
  isPastDate,
} from '../config/appointmentSchedule';
import type { OpeningHour, SlotInfo } from '../types/database';

interface AppointmentCalendarProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: string | null) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}) => {
  const { language, t } = useLanguage();
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [liveSlots, setLiveSlots] = useState<SlotInfo[]>([]);
  const [dayClosed, setDayClosed] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchOpeningHoursPublic()
      .then(setOpeningHours)
      .catch(() => setOpeningHours([]));
  }, []);

  const locale = language === 'it' ? 'it-IT' : 'en-GB';
  const monthLabel = useMemo(
    () => viewDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
    [locale, viewDate],
  );

  const weekdayLabels = useMemo(() => {
    const base = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, index) =>
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + index).toLocaleDateString(
        locale,
        { weekday: 'short' },
      ),
    );
  }, [locale]);

  const monthCells = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  useEffect(() => {
    if (!selectedDate) {
      setLiveSlots([]);
      return;
    }
    const dateKey = formatDateKey(selectedDate);
    if (!isSupabaseConfigured) {
      const fallback = getTimeSlotsForDate(selectedDate);
      const booked = getBookedSlotsForDate(selectedDate);
      setDayClosed(!isDayOpen(selectedDate) || isPastDate(selectedDate));
      setLiveSlots(fallback.map((time) => ({ time, available: !booked.has(time) })));
      return;
    }
    setLoadingSlots(true);
    fetchAvailability(dateKey)
      .then((data) => {
        setDayClosed(data.isClosed);
        setLiveSlots(data.slots);
      })
      .catch(() => {
        const fallback = getTimeSlotsForDate(selectedDate);
        setLiveSlots(fallback.map((time) => ({ time, available: true })));
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const shiftMonth = (delta: number) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const handleSelectDate = (date: Date) => {
    if (isPastDate(date)) return;
    if (isDayClosed(date)) return;
    onDateChange(date);
    onTimeChange(null);
  };

  const isDayClosed = (date: Date) => {
    if (openingHours.length >= 7) {
      return isDayClosedFromHours(openingHours, date);
    }
    return !isDayOpen(date);
  };

  const isDateDisabled = (date: Date) => {
    if (isPastDate(date)) return true;
    return isDayClosed(date);
  };

  return (
    <div className="appointment-calendar">
      <p className="label-field">
        {t('contact.form.calendarTitle')}
        <RequiredMark />
      </p>

      <div className="rounded-md border border-ink-soft/25 bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-soft/30 text-ink transition-colors hover:border-brand-cyan hover:text-brand-cyan"
            aria-label={String(t('contact.form.calendarPrev'))}
          >
            <ChevronLeft size={18} />
          </button>
          <p className="font-display text-base font-semibold capitalize text-ink md:text-lg">
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-soft/30 text-ink transition-colors hover:border-brand-cyan hover:text-brand-cyan"
            aria-label={String(t('contact.form.calendarNext'))}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekdayLabels.map((label) => (
            <div
              key={label}
              className="py-1 text-center text-xs font-semibold uppercase tracking-wide text-ink-muted"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthCells.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} aria-hidden />;
            }

            const disabled = isDateDisabled(date);
            const isSelected =
              selectedDate !== null && formatDateKey(selectedDate) === formatDateKey(date);
            const isToday = formatDateKey(date) === formatDateKey(new Date());

            return (
              <button
                key={formatDateKey(date)}
                type="button"
                disabled={disabled}
                onClick={() => handleSelectDate(date)}
                className={`appointment-day ${disabled ? 'appointment-day--disabled' : ''} ${
                  isSelected ? 'appointment-day--selected' : ''
                } ${isToday ? 'appointment-day--today' : ''}`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="label-field">
          {t('contact.form.calendarTime')}
          <RequiredMark />
        </p>

        {!selectedDate ? (
          <p className="text-sm text-ink-muted">{t('contact.form.calendarSelectDate')}</p>
        ) : loadingSlots ? (
          <p className="text-sm text-ink-muted">Loading times…</p>
        ) : dayClosed || liveSlots.length === 0 ? (
          <p className="text-sm text-ink-muted">{t('contact.form.calendarClosed')}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {liveSlots.map(({ time, available }) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  disabled={!available}
                  onClick={() => onTimeChange(time)}
                  className={`appointment-slot ${!available ? 'appointment-slot--booked' : ''} ${
                    isSelected ? 'appointment-slot--selected' : ''
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default AppointmentCalendar;
