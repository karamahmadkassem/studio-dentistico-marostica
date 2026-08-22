import { handleOptions, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { createSession, verifyPassword } from '../_shared/auth.ts';

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

  try {
    const { username, password } = await req.json();
    if (!username || !password) return errorResponse('Username and password required', 400);

    const supabase = getServiceClient();
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) return errorResponse('Invalid credentials', 401);

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return errorResponse('Account temporarily locked. Try again later.', 423);
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      const attempts = (user.failed_login_attempts ?? 0) + 1;
      const updates: Record<string, unknown> = { failed_login_attempts: attempts };
      if (attempts >= MAX_ATTEMPTS) {
        updates.locked_until = new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString();
        updates.failed_login_attempts = 0;
      }
      await supabase.from('admin_users').update(updates).eq('id', user.id);
      return errorResponse('Invalid credentials', 401);
    }

    await supabase
      .from('admin_users')
      .update({ failed_login_attempts: 0, locked_until: null })
      .eq('id', user.id);

    const token = await createSession(user.id);
    if (!token) throw new Error('Failed to create session');
    return jsonResponse({ token, username: user.username });
  } catch (e) {
    console.error(e);
    return errorResponse('Login failed', 500);
  }
});
