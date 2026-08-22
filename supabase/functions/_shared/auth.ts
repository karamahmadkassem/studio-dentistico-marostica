import bcrypt from 'npm:bcryptjs@2.4.3';
import { getServiceClient } from './supabase.ts';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSession(adminUserId: string): Promise<string> {
  const token = crypto.randomUUID() + crypto.randomUUID();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  const supabase = getServiceClient();
  const { error } = await supabase.from('admin_sessions').insert({
    admin_user_id: adminUserId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });
  if (error) throw error;
  return token;
}

export async function verifySession(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const tokenHash = await hashToken(token);
  const supabase = getServiceClient();
  const { data } = await supabase
    .from('admin_sessions')
    .select('admin_user_id, expires_at')
    .eq('token_hash', tokenHash)
    .maybeSingle();
  if (!data) return null;
  if (new Date(data.expires_at) < new Date()) {
    await supabase.from('admin_sessions').delete().eq('token_hash', tokenHash);
    return null;
  }
  return data.admin_user_id as string;
}

export async function destroySession(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return;
  const tokenHash = await hashToken(authHeader.slice(7));
  const supabase = getServiceClient();
  await supabase.from('admin_sessions').delete().eq('token_hash', tokenHash);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compareSync(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hashSync(password, 12);
}
