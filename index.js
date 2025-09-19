import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { license } = req.body;
  const { data: rec, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_key', license)
    .single();

  if (error || !rec) return res.status(404).json({ error: 'NOT_FOUND' });

  const expired = rec.expires_at && new Date() > new Date(rec.expires_at);
  if (rec.status !== 'active' || expired) return res.status(403).json({ error: 'EXPIRED' });

  res.json({
    web_info: { client: rec.client_name, license: rec.license_key },
    web__dev: { author: 'whettxitrmodz', github: 'https://github.com/whettxitr-modz' }
  });
}
