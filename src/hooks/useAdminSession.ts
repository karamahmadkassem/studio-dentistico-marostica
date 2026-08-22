import { useEffect, useState, useCallback } from 'react';
import { adminCheckSession, clearAdminToken } from '../lib/api';

export function useAdminSession() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const ok = await adminCheckSession();
      setAuthenticated(ok);
      if (!ok) clearAdminToken();
    } catch {
      setAuthenticated(false);
      clearAdminToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, authenticated, refresh };
}
