const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initDb() {
  return new Promise((resolve, reject) => {
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS platforms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          access_token TEXT,
          page_id TEXT,
          instagram_account_id TEXT,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          caption TEXT NOT NULL,
          image_url TEXT,
          status TEXT DEFAULT 'draft',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS post_platforms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          post_id INTEGER NOT NULL,
          platform_id INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          posted_at DATETIME,
          error TEXT,
          FOREIGN KEY (post_id) REFERENCES posts(id),
          FOREIGN KEY (platform_id) REFERENCES platforms(id)
        );

        CREATE TABLE IF NOT EXISTS schedules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          post_id INTEGER NOT NULL,
          platform_id INTEGER NOT NULL,
          scheduled_at DATETIME NOT NULL,
          recurrence TEXT DEFAULT 'none',
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (post_id) REFERENCES posts(id),
          FOREIGN KEY (platform_id) REFERENCES platforms(id)
        );
      `);

      // Seed default admin user
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@example.com');
      if (!existing) {
        const hash = bcrypt.hashSync('admin123', 10);
        db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
          'Admin User',
          'admin@example.com',
          hash,
          'admin'
        );
      }

      resolve(db);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { db, initDb };
