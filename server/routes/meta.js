const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { db } = require('../db');

router.post('/publish', authenticate, (req, res) => {
  const { postId, platformId } = req.body;
  if (!postId || !platformId) {
    return res.status(400).json({ error: 'postId and platformId are required' });
  }
  // TODO: Integrate Meta Graph API here (Instagram/Facebook publishing)
  res.json({
    success: true,
    message: 'Publish endpoint ready. Add Meta Graph API access token to post live.',
  });
});

router.get('/status', authenticate, (_req, res) => {
  res.json({
    instagram: 'not_connected',
    facebook: 'not_connected',
    note: 'Add Meta access tokens on the Platforms page',
  });
});

module.exports = router;
