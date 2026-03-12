const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'codeclash.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id   TEXT    UNIQUE NOT NULL,
    name        TEXT    NOT NULL,
    email       TEXT    UNIQUE NOT NULL,
    avatar      TEXT,
    wins        INTEGER DEFAULT 0,
    losses      INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS match_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    opponent    TEXT    NOT NULL,
    result      TEXT    NOT NULL,
    score       INTEGER DEFAULT 0,
    rounds      INTEGER DEFAULT 1,
    difficulty  TEXT    DEFAULT 'Medium',
    played_at   TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = {
  findByGoogleId(googleId) {
    return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
  },

  findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  createUser({ googleId, name, email, avatar }) {
    const result = db.prepare(
      'INSERT INTO users (google_id, name, email, avatar) VALUES (?, ?, ?, ?)'
    ).run(googleId, name, email, avatar);
    return db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  },

  updateStats(userId, { wins = 0, losses = 0, scoreToAdd = 0 }) {
    db.prepare(`
            UPDATE users
            SET wins = wins + ?, losses = losses + ?, total_score = total_score + ?
            WHERE id = ?
        `).run(wins, losses, scoreToAdd, userId);
  },

  addMatchHistory(userId, { opponent, result, score, rounds, difficulty }) {
    db.prepare(`
            INSERT INTO match_history (user_id, opponent, result, score, rounds, difficulty)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(userId, opponent, result, score, rounds, difficulty);
  },

  getMatchHistory(userId, limit = 10) {
    return db.prepare(`
            SELECT * FROM match_history
            WHERE user_id = ?
            ORDER BY played_at DESC
            LIMIT ?
        `).all(userId, limit);
  },

  getLeaderboard(limit = null) {
    if (limit) {
      return db.prepare(`
                SELECT id, name, avatar, wins, losses, total_score
                FROM users ORDER BY wins DESC, total_score DESC LIMIT ?
            `).all(limit);
    }
    return db.prepare(`
            SELECT id, name, avatar, wins, losses, total_score
            FROM users ORDER BY wins DESC, total_score DESC
        `).all();
  },

  getUserRank(userId) {
    const row = db.prepare(`
            SELECT COUNT(*) + 1 AS rank FROM users
            WHERE wins > (SELECT wins FROM users WHERE id = ?)
               OR (wins = (SELECT wins FROM users WHERE id = ?) AND total_score > (SELECT total_score FROM users WHERE id = ?))
        `).get(userId, userId, userId);
    return row ? row.rank : 1;
  }
};
