const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db, rowToObject } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash = bcrypt.hashSync(password, 10);
    const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hash);
    const token = jwt.sign({ id: info.lastInsertRowid, email, name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: info.lastInsertRowid, name, email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  try {
    const user = rowToObject(['id', 'name', 'email', 'password', 'role', 'created_at'],
      db.prepare('SELECT * FROM users WHERE email = ?').get(email));
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }
  const token = header.split(' ')[1];
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
