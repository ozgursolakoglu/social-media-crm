const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { db } = require('../db');

router.get('/', authenticate, (req, res) => {
  const schedules = db
    .prepare(
      `SELECT s.id, s.scheduled_at, s.recurrence, s.status,
              p.id AS post_id, p.caption,
              pl.id AS platform_id, pl.name AS platform_name, pl.type
       FROM schedules s
       JOIN posts p ON s.post_id = p.id
       JOIN platforms pl ON s.platform_id = pl.id
       WHERE p.user_id = ?
       ORDER BY s.scheduled_at ASC`
    )
    .all(req.user.id);
  res.json(schedules);
});

router.post('/', authenticate, (req, res) => {
  const { postId, platformId, scheduledAt, recurrence = 'none' } = req.body;
  if (!postId || !platformId || !scheduledAt) {
    return res.status(400).json({ error: 'postId, platformId and scheduledAt are required' });
  }
  try {
    const info = db
      .prepare(
        `INSERT INTO schedules (post_id, platform_id, scheduled_at, recurrence)
         VALUES (?, ?, ?, ?)`
      )
      .run(postId, platformId, scheduledAt, recurrence);
    res.json({ id: info.lastInsertRowid, message: 'Scheduled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    db.prepare('DELETE FROM schedules WHERE id = ?').run(req.params.id);
    res.json({ message: 'Schedule removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
