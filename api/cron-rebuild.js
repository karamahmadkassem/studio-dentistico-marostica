export default async function handler(req, res) {
  const expected = process.env.CRON_SECRET;
  const auth = req.headers.authorization || '';
  if (expected && auth !== `Bearer ${expected}`) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) {
    res.status(500).json({ error: 'missing_deploy_hook' });
    return;
  }

  const response = await fetch(hook, { method: 'POST' });
  res.status(response.ok ? 200 : 502).json({ ok: response.ok });
}
