// Aiven MySQL connection (server only — never sent to the browser)
const mysql = require('mysql2/promise');

let pool;
let ready;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'defaultdb',
      ssl: process.env.DB_CA
        ? { ca: process.env.DB_CA.replace(/\\n/g, '\n') }
        : { rejectUnauthorized: false },
      connectionLimit: 3,
      connectTimeout: 10000,
      timezone: 'Z',
      charset: 'utf8mb4'
    });
  }
  return pool;
}

const SCHEMA = `CREATE TABLE IF NOT EXISTS registrations (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  full_name  VARCHAR(150) NOT NULL,
  department VARCHAR(150) NOT NULL,
  batch      INT          NOT NULL,
  phone      VARCHAR(30)  NOT NULL,
  phone_norm VARCHAR(20)  NOT NULL,
  team       VARCHAR(50)  NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_team (team),
  INDEX idx_phone (phone_norm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

// Returns a pool; creates the table automatically the first time.
exports.getDb = async () => {
  const p = getPool();
  if (!ready) ready = p.query(SCHEMA).catch(e => { ready = null; throw e; });
  await ready;
  return p;
};

// { "love":"pass", "worship":"pass" ... }  — kept only in Vercel env variables
exports.getTeamPasswords = () => {
  try { return JSON.parse(process.env.TEAM_PASSWORDS || '{}'); }
  catch (e) { return {}; }
};
