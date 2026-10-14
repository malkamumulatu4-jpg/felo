const { getDb } = require('./_db');

// Fixed list of teams (must match the ids in js/config.js)
const VALID_TEAMS = ['love', 'actions', 'worship', 'choir', 'art', 'fund'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const b = req.body || {};
    const name = String(b.name || '').trim();
    const department = String(b.department || '').trim();
    const batch = Number(b.batch);
    const phone = String(b.phone || '').trim();
    const teams = [...new Set(Array.isArray(b.teams) ? b.teams.map(String) : [])]
      .filter(t => VALID_TEAMS.includes(t));

    if (name.length < 3 || name.length > 150 || !department || department.length > 150 ||
        !Number.isInteger(batch) || batch < 1 || batch > 99)
      return res.status(400).json({ error: 'Please fill in every field correctly.' });
    if (!/^[0-9+\-\s()]{7,15}$/.test(phone))
      return res.status(400).json({ error: 'Please enter a valid telephone number.' });
    if (!teams.length)
      return res.status(400).json({ error: 'Please choose at least one team.' });

    const phoneNorm = phone.replace(/\D/g, '');
    const db = await getDb();

    const [existing] = await db.query(
      'SELECT team FROM registrations WHERE phone_norm = ? AND LOWER(full_name) = LOWER(?) AND team IN (?)',
      [phoneNorm, name, teams]
    );
    const already = existing.map(r => r.team);
    const joined = teams.filter(t => !already.includes(t));

    if (joined.length) {
      await db.query(
        'INSERT INTO registrations (full_name, department, batch, phone, phone_norm, team) VALUES ?',
        [joined.map(t => [name, department, batch, phone, phoneNorm, t])]
      );
    }
    res.json({ ok: true, joined, already });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
