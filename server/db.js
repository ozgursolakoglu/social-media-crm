const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');

let sqlDb = null;
let dbWrapper = null;

async function initDb() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(__dirname, 'node_modules', 'sql.js', 'dist', file),
  });

  let dbData;
  try {
    dbData = fs.readFileSync(dbPath);
  } catch {
    dbData = null;
  }

  sqlDb = new SQL.Database(dbData);

  sqlDb.exec(`
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
  const existing = sqlDb.prepare('SELECT id FROM users WHERE email = ?').get(['admin@example.com']);
  if (!existing || existing.length === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    sqlDb.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run([
      'Admin User',
      'admin@example.com',
      hash,
      'admin',
    ]);
  }

  // Persist initial state to file
  fs.writeFileSync(dbPath, Buffer.from(sqlDb.export()));

  dbWrapper = {
    prepare: (sql) => ({
      get: (...params) => {
        const stmt = sqlDb.prepare(sql);
        const result = stmt.get(params);
        stmt.free();
        if (!result || result.length === 0) return undefined;
        return result;
      },
      run: (...params) => {
        const stmt = sqlDb.prepare(sql);
        const result = stmt.run(params);
        stmt.free();
        fs.writeFileSync(dbPath, Buffer.from(sqlDb.export()));
        return result;
      },
      all: (...params) => {
        const stmt = sqlDb.prepare(sql);
        const result = stmt.all(params);
        stmt.free();
        return result;
      },
    }),
  };

  // Helper: convert array row to object given column names
  const rowToObject = (columns, row) => {
    if (!row || row.length === 0) return undefined;
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  };

  // Helper: convert array rows to objects given column names
  const rowsToObject = (columns, rows) => {
    return rows.map((row) => {
      const obj = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  };

  return dbWrapper;
}

// Helper: convert array row to object given column names
const rowToObject = (columns, row) => {
  if (!row || row.length === 0) return undefined;
  const obj = {};
  columns.forEach((col, i) => {
    obj[col] = row[i];
  });
  return obj;
};

// Helper: convert array rows to objects given column names
const rowsToObject = (columns, rows) => {
  return rows.map((row) => {
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
};

// Proxy so routes can keep using `const { db } = require('../db')` without changes
const dbProxy = new Proxy(
  {},
  {
    get(_target, prop) {
      if (!dbWrapper) {
        throw new Error('Database not initialized. Call initDb() first.');
      }
      return dbWrapper[prop];
    },
  },
);

module.exports = { db: dbProxy, initDb, rowToObject, rowsToObject };
