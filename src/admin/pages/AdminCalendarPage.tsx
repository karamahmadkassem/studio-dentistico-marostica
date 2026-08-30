import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { adminApi } from '../../lib/api';
import type { Appointment, OpeningHour } from '../../types/database';
import { useAdminNotifications } from '../AdminNotificationsContext';
import {
  SLOT_MINUTES,
  parseTimeToMinutes,
  formatMinutesToTime,
  formatDateKey,
  getClinicTodayDate,
  getClinicTodayKey,
} from '../../config/appointmentSchedule';
import { normalizeOpeningHours } from '../../lib/openingHoursDisplay';

type ViewMode = 'day' | 'week' | 'month';

const STATUS_CLASS: Record<string, string> = {
  pending: 'admin-appt--pending',
  accepted: 'admin-appt--accepted',
  review_sent: 'admin-appt--review-sent',
  cancelled: 'admin-appt--cancelled',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function generateSlotsFromHours(hours: OpeningHour[], dayOfWeek: number): string[] {
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

const AdminCalendarPage: React.FC = () => {
  const { refreshToken } = useAdminNotifications();
  const [view, setView] = useState<ViewMode>('week');
  const [cursor, setCursor] = useState(() => getClinicTodayDate());
  const todayKey = getClinicTodayKey();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHours, setShowHours] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState('');

  const range = useMemo(() => {
    if (view === 'day') {
      const d = formatDateKey(cursor);
      return { from: d, to: d };
    }
    if (view === 'week') {
      const start = addDays(cursor, -((cursor.getDay() + 6) % 7));
      const end = addDays(start, 6);
      return { from: formatDateKey(start), to: formatDateKey(end) };
    }
    const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    return { from: formatDateKey(start), to: formatDateKey(end) };
  }, [view, cursor]);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    try {
      const [appts, hrs] = await Promise.all([
        adminApi.getAppointments(range.from, range.to),
        adminApi.getOpeningHours(),
      ]);
      setAppointments(appts);
      setHours(
        hrs.map((h: OpeningHour) => ({
          ...h,
          open_time: h.is_closed ? null : h.open_time?.slice(0, 5) ?? '09:00',
          close_time: h.is_closed ? null : h.close_time?.slice(0, 5) ?? (h.day_of_week === 6 ? '13:00' : '19:00'),
        })),
      );
    } finally {
      if (!options?.silent) setLoading(false);
    }
  }, [range.from, range.to]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (refreshToken === 0) return;
    load({ silent: true });
  }, [refreshToken, load]);

  const apptMap = useMemo(() => {
    const map = new Map<string, Appointment>();
    for (const a of appointments) {
      const time = String(a.appointment_time).slice(0, 5);
      map.set(`${a.appointment_date}|${time}`, a);
    }
    return map;
  }, [appointments]);

  const weekDays = useMemo(() => {
    const start = addDays(cursor, -((cursor.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const allSlotTimes = useMemo(() => {
    const set = new Set<string>();
    for (let dow = 0; dow < 7; dow++) {
      generateSlotsFromHours(hours, dow).forEach((s) => set.add(s));
    }
    return Array.from(set).sort();
  }, [hours]);

  const handleAccept = async (appt: Appointment) => {
    await adminApi.updateAppointment(appt.id, { status: 'accepted' });
    setSelected(null);
    load();
  };

  const handleSendReview = async (appt: Appointment) => {
    await adminApi.sendReviewInvite(appt.id);
    setSelected(null);
    load();
  };

  const handleCancel = async () => {
    if (!selected) return;
    setCancelling(true);
    setActionError('');
    try {
      await adminApi.cancelAppointment(selected.id, cancelReason);
      setSelected(null);
      setShowCancelForm(false);
      setCancelReason('');
      load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  const openAppointment = (appt: Appointment) => {
    setSelected(appt);
    setShowCancelForm(false);
    setCancelReason('');
    setActionError('');
  };

  const saveHours = async () => {
    setSavingHours(true);
    try {
      await adminApi.saveOpeningHours(normalizeOpeningHours(hours));
      setShowHours(false);
      load();
    } finally {
      setSavingHours(false);
    }
  };

  const shift = (delta: number) => {
    if (view === 'day') setCursor(addDays(cursor, delta));
    else if (view === 'week') setCursor(addDays(cursor, delta * 7));
    else setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Calendar</h1>
          <p className="admin-page-subtitle">
            {range.from} — {range.to}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="admin-view-toggle">
            {(['day', 'week', 'month'] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                className={view === v ? 'active' : ''}
                onClick={() => setView(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button type="button" className="btn-navy px-4 py-2 text-sm" onClick={() => setShowHours(true)}>
            Opening hours
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} className="admin-nav-btn" aria-label="Previous">
          <ChevronLeft size={20} />
        </button>
        <button type="button" onClick={() => setCursor(getClinicTodayDate())} className="text-sm font-medium text-brand-cyan">
          Today
        </button>
        <button type="button" onClick={() => shift(1)} className="admin-nav-btn" aria-label="Next">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="admin-legend">
        <span><i className="admin-appt-swatch admin-appt--pending" /> Pending (blue)</span>
        <span><i className="admin-appt-swatch admin-appt--accepted" /> Accepted (yellow)</span>
        <span><i className="admin-appt-swatch admin-appt--review-sent" /> Review sent (green)</span>
        <span><i className="admin-appt-swatch admin-appt--off" /> Closed / off hours</span>
      </div>

      {loading ? (
        <p className="text-ink-muted">Loading calendar…</p>
      ) : view === 'month' ? (
        <div className="admin-month-grid">
          {DAY_NAMES.map((d) => (
            <div key={d} className="admin-month-head">{d}</div>
          ))}
          {(() => {
            const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
            const offset = (first.getDay() + 6) % 7;
            const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
            const cells: React.ReactNode[] = [];
            for (let i = 0; i < offset; i++) cells.push(<div key={`e${i}`} />);
            for (let day = 1; day <= daysInMonth; day++) {
              const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
              const key = formatDateKey(d);
              const dow = d.getDay();
              const row = hours.find((h) => h.day_of_week === dow);
              const closed = row?.is_closed ?? true;
              const dayAppts = appointments.filter((a) => a.appointment_date === key);
              cells.push(
                <div
                  key={key}
                  className={`admin-month-cell${closed ? ' admin-month-cell--closed' : ''}${
                    key === todayKey ? ' admin-month-cell--today' : ''
                  }`}
                >
                  <span className="font-semibold">{day}</span>
                  {dayAppts.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={`admin-appt-chip ${STATUS_CLASS[a.status]}`}
                      onClick={() => openAppointment(a)}
                    >
                      {String(a.appointment_time).slice(0, 5)} {a.first_name}
                    </button>
                  ))}
                </div>,
              );
            }
            return cells;
          })()}
        </div>
      ) : (
        <div
          className="admin-schedule-grid overflow-x-auto"
          style={{ ['--cols' as string]: view === 'day' ? 1 : 7 }}
        >
          <div className="admin-schedule-corner" />
          {(view === 'day' ? [cursor] : weekDays).map((d) => {
            const key = formatDateKey(d);
            const dow = d.getDay();
            const row = hours.find((h) => h.day_of_week === dow);
            const closed = row?.is_closed ?? true;
            return (
              <div
                key={key}
                className={`admin-schedule-day-head${closed ? ' admin-schedule-day-head--closed' : ''}${
                  key === todayKey ? ' admin-schedule-day-head--today' : ''
                }`}
              >
                {DAY_NAMES[dow]} {d.getDate()}
              </div>
            );
          })}
          {allSlotTimes.map((time) => (
            <React.Fragment key={time}>
              <div className="admin-schedule-time">{time}</div>
              {(view === 'day' ? [cursor] : weekDays).map((d) => {
                const key = formatDateKey(d);
                const dow = d.getDay();
                const daySlots = generateSlotsFromHours(hours, dow);
                const off = !daySlots.includes(time);
                const appt = apptMap.get(`${key}|${time}`);
                return (
                  <div
                    key={`${key}-${time}`}
                    className={`admin-schedule-cell${off ? ' admin-schedule-cell--off' : ''}`}
                  >
                    {appt && (
                      <button
                        type="button"
                        className={`admin-appt-block ${STATUS_CLASS[appt.status]}`}
                        onClick={() => openAppointment(appt)}
                      >
                        {appt.first_name} {appt.last_name.charAt(0)}.
                      </button>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}

      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="heading-section text-lg">Appointment</h2>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="font-semibold">Patient</dt><dd>{selected.first_name} {selected.last_name}</dd></div>
              <div><dt className="font-semibold">Phone</dt><dd>{selected.phone}</dd></div>
              <div><dt className="font-semibold">Email</dt><dd>{selected.email}</dd></div>
              <div><dt className="font-semibold">Service</dt><dd>{selected.service_name || '—'}</dd></div>
              <div><dt className="font-semibold">When</dt><dd>{selected.appointment_date} {String(selected.appointment_time).slice(0, 5)}</dd></div>
              {selected.message && <div><dt className="font-semibold">Message</dt><dd>{selected.message}</dd></div>}
              {selected.status === 'cancelled' && selected.cancellation_reason && (
                <div><dt className="font-semibold">Cancellation reason</dt><dd>{selected.cancellation_reason}</dd></div>
              )}
              <div><dt className="font-semibold">Status</dt><dd className="capitalize">{selected.status.replace('_', ' ')}</dd></div>
            </dl>

            {showCancelForm ? (
              <div className="mt-6 space-y-4 border-t border-ink-soft/15 pt-4">
                <p className="text-sm text-ink-muted">
                  The patient will receive an apology email. The time slot will become available again.
                </p>
                <div>
                  <label htmlFor="cancel-reason" className="label-field">
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    id="cancel-reason"
                    className="input-field"
                    rows={3}
                    placeholder="e.g. The dentist is unavailable on this date"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </div>
                {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-danger" disabled={cancelling} onClick={handleCancel}>
                    {cancelling ? 'Cancelling…' : 'Confirm cancellation'}
                  </button>
                  <button
                    type="button"
                    className="btn-white border border-ink-soft/30"
                    disabled={cancelling}
                    onClick={() => {
                      setShowCancelForm(false);
                      setCancelReason('');
                      setActionError('');
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-2">
                {selected.status === 'pending' && (
                  <button type="button" className="btn-primary" onClick={() => handleAccept(selected)}>
                    Accept appointment
                  </button>
                )}
                {selected.status === 'accepted' && (
                  <button type="button" className="btn-primary" onClick={() => handleSendReview(selected)}>
                    Send review email
                  </button>
                )}
                {(selected.status === 'pending' || selected.status === 'accepted') && (
                  <button type="button" className="btn-danger" onClick={() => setShowCancelForm(true)}>
                    Cancel appointment
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showHours && (
        <div className="admin-modal-overlay" onClick={() => setShowHours(false)}>
          <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()}>
            <h2 className="heading-section text-lg">Opening hours</h2>
            <div className="mt-4 space-y-3">
              {hours.map((h, idx) => (
                <div key={h.day_of_week} className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="w-24 font-medium">{DAY_NAMES[h.day_of_week]}</span>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={h.is_closed}
                      onChange={(e) => {
                        const next = [...hours];
                        next[idx] = { ...h, is_closed: e.target.checked };
                        setHours(next);
                      }}
                    />
                    Closed
                  </label>
                  {!h.is_closed && (
                    <>
                      <input
                        type="time"
                        className="input-field w-auto"
                        value={h.open_time?.slice(0, 5) ?? '09:00'}
                        onChange={(e) => {
                          const next = [...hours];
                          next[idx] = { ...h, open_time: e.target.value };
                          setHours(next);
                        }}
                      />
                      <span>—</span>
                      <input
                        type="time"
                        className="input-field w-auto"
                        value={h.close_time?.slice(0, 5) ?? '19:00'}
                        onChange={(e) => {
                          const next = [...hours];
                          next[idx] = { ...h, close_time: e.target.value };
                          setHours(next);
                        }}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" className="btn-primary" disabled={savingHours} onClick={saveHours}>
                {savingHours ? 'Saving…' : 'Save hours'}
              </button>
              <button type="button" className="btn-white border border-ink-soft/30" onClick={() => setShowHours(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendarPage;
