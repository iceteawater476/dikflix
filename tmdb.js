// Vercel serverless proxy: keeps the TMDB key off the client.
// Set TMDB_KEY in Vercel → Project → Settings → Environment Variables.
module.exports = async (req, res) => {
  const { p, ...rest } = req.query;
  if (!/^\/[\w/-]+$/.test(p || '')) return res.status(400).json({ error: 'bad path' });
  const qs = new URLSearchParams({ language: 'en-US', ...rest, api_key: process.env.TMDB_KEY });
  const r = await fetch(`https://api.themoviedb.org/3${p}?${qs}`);
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
  res.status(r.status).json(await r.json());
};
