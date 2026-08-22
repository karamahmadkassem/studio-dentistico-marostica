import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { adminApi } from '../lib/api';
import { formatDateKey } from '../config/appointmentSchedule';
import type { Appointment } from '../types/database';

const POLL_VISIBLE_MS = 15_000;
const POLL_HIDDEN_MS = 60_000;

export type AdminNotification = {
  id: string;
  appointmentId: string;
  title: string;
  detail: string;
  createdAt: number;
};

type AdminNotificationsContextValue = {
  pendingCount: number;
  refreshToken: number;
  dismissNotification: (id: string) => void;
};

const AdminNotificationsContext = createContext<AdminNotificationsContextValue | null>(null);

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildNotification(appt: Appointment): AdminNotification {
  const time = String(appt.appointment_time).slice(0, 5);
  return {
    id: appt.id,
    appointmentId: appt.id,
    title: 'New booking',
    detail: `${appt.first_name} ${appt.last_name} — ${appt.appointment_date} at ${time}`,
    createdAt: Date.now(),
  };
}

export const AdminNotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((current) => current.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    const poll = async () => {
      try {
        const from = formatDateKey(new Date());
        const to = formatDateKey(addDays(new Date(), 120));
        const appts = (await adminApi.getAppointments(from, to)) as Appointment[];
        if (cancelled) return;

        const pending = appts.filter((a) => a.status === 'pending');
        setPendingCount(pending.length);

        const currentIds = new Set(appts.map((a) => a.id));
        if (!initializedRef.current) {
          knownIdsRef.current = currentIds;
          initializedRef.current = true;
        } else {
          const newPending = appts.filter(
            (a) => a.status === 'pending' && !knownIdsRef.current.has(a.id),
          );
          if (newPending.length > 0) {
            setNotifications((current) => {
              const existing = new Set(current.map((n) => n.id));
              const next = newPending
                .map(buildNotification)
                .filter((n) => !existing.has(n.id));
              return [...next, ...current].slice(0, 5);
            });
            setRefreshToken((value) => value + 1);
          }
          knownIdsRef.current = currentIds;
        }
      } catch {
        // Ignore transient poll errors (logged out, network, etc.)
      }

      if (!cancelled) {
        const delay = document.visibilityState === 'visible' ? POLL_VISIBLE_MS : POLL_HIDDEN_MS;
        timer = window.setTimeout(poll, delay);
      }
    };

    const handleVisibility = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(poll, 500);
    };

    poll();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;
    const timers = notifications.map((notification) =>
      window.setTimeout(() => dismissNotification(notification.id), 12_000),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [notifications, dismissNotification]);

  return (
    <AdminNotificationsContext.Provider value={{ pendingCount, refreshToken, dismissNotification }}>
      {children}
      {notifications.length > 0 && (
        <div className="admin-toast-stack" aria-live="polite">
          {notifications.map((notification) => (
            <div key={notification.id} className="admin-toast">
              <div className="admin-toast-icon" aria-hidden>
                <Bell size={18} />
              </div>
              <div className="admin-toast-body">
                <p className="admin-toast-title">{notification.title}</p>
                <p className="admin-toast-detail">{notification.detail}</p>
                <button
                  type="button"
                  className="admin-toast-action"
                  onClick={() => {
                    dismissNotification(notification.id);
                    navigate('/admin/calendar');
                  }}
                >
                  View calendar
                </button>
              </div>
              <button
                type="button"
                className="admin-toast-close"
                aria-label="Dismiss notification"
                onClick={() => dismissNotification(notification.id)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminNotificationsContext.Provider>
  );
};

export function useAdminNotifications(): AdminNotificationsContextValue {
  const ctx = useContext(AdminNotificationsContext);
  if (!ctx) {
    throw new Error('useAdminNotifications must be used within AdminNotificationsProvider');
  }
  return ctx;
}
