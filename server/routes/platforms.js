const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { db, rowsToObject } = require('../db');

router.get('/', authenticate, (_req, res) => {
  const columns = ['id', 'name', 'type', 'access_token', 'page_id', 'instagram_account_id', 'is_active'];
  const rows = db
    .prepare('SELECT id, name, type, access_token, page_id, instagram_account_id, is_active FROM platforms ORDER BY id DESC')
    .all();
  const platforms = rowsToObject(columns, rows);
  res.json(platforms);
});

router.post('/connect', authenticate, (req, res) => {
  const { name, type, accessToken, pageId, instagramAccountId } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: 'Platform name and type are required' });
  }
  try {
    const info = db
      .prepare(
        `INSERT INTO platforms (user_id, name, type, access_token, page_id, instagram_account_id)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(req.user.id, name, type, accessToken || null, pageId || null, instagramAccountId || null);
    res.json({
      id: info.lastInsertRowid,
      message: 'Platform connected. Credentials are stored locally; replace with Meta OAuth in production.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    db.prepare('DELETE FROM platforms WHERE id = ?').run(req.params.id);
    res.json({ message: 'Platform removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
