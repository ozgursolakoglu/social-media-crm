require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const platformRoutes = require('./routes/platforms');
const postRoutes = require('./routes/posts');
const scheduleRoutes = require('./routes/schedules');
const metaRoutes = require('./routes/meta');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/meta', metaRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'social-media-crm-api' });
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
