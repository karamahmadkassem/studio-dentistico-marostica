import { handleOptions, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { destroySession, verifySession } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const auth = req.headers.get('Authorization');

  if (req.method === 'POST') {
    await destroySession(auth);
    return jsonResponse({ ok: true });
  }

  if (req.method === 'GET') {
    const adminId = await verifySession(auth);
    if (!adminId) return errorResponse('Unauthorized', 401);
    return jsonResponse({ authenticated: true, adminId });
  }

  return errorResponse('Method not allowed', 405);
});
