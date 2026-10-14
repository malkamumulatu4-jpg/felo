const crypto = require('crypto');
const { getDb, getTeamPasswords } = require('./_db');

function safeEqual(a, b) {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

// Team leader: login + list + delete (each team sees ONLY its own rows)
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { team, password, action, id } = req.body || {};
    const passwords = getTeamPasswords();
    if (!team || !Object.prototype.hasOwnProperty.call(passwords, team) ||
        !safeEqual(passwords[team], password || ''))
      return res.status(401).json({ error: 'Wrong password for that team.' });

    const db = await getDb();
    if (action === 'delete') {
      await db.query('DELETE FROM registrations WHERE id = ? AND team = ?', [Number(id), team]);
    }
    const [rows] = await db.query(
      `SELECT id, full_name AS name, department, batch, phone, created_at AS createdAt
       FROM registrations WHERE team = ? ORDER BY created_at DESC, id DESC`,
      [team]
    );
    res.json({ ok: true, rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
