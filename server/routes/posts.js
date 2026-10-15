const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { db, rowsToObject } = require('../db');

router.get('/', authenticate, (req, res) => {
  const columns = ['id', 'user_id', 'caption', 'image_url', 'status', 'created_at'];
  const rows = db
    .prepare('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  const posts = rowsToObject(columns, rows);
  res.json(posts);
});

router.post('/', authenticate, (req, res) => {
  const { caption, imageUrl, platforms = [] } = req.body;
  if (!caption) return res.status(400).json({ error: 'Caption is required' });

  try {
    const info = db
      .prepare('INSERT INTO posts (user_id, caption, image_url, status) VALUES (?, ?, ?, ?)')
      .run(req.user.id, caption, imageUrl || null, 'draft');
    const postId = info.lastInsertRowid;

    platforms.forEach((pid) => {
      db.prepare('INSERT INTO post_platforms (post_id, platform_id, status) VALUES (?, ?, ?)').run(
        postId,
        pid,
        'pending'
      );
    });

    res.json({ id: postId, message: 'Post created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
