const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./db');
const { contentDir } = require('./upload');

const rolesRouter = require('./routes/roles');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const postsRouter = require('./routes/posts');
const mediaRouter = require('./routes/media');
const contactRouter = require('./routes/contactMessages');
const progressRouter = require('./routes/progress');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'VitaFit API running' });
});
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'VitaFit API running' });
});

app.use('/content', express.static(contentDir));

app.use('/api/roles', rolesRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/contact-messages', contactRouter);
app.use('/api/progress', progressRouter);

const port = process.env.PORT || 4000;

// Only start the server when run directly (e.g. node src/app.js). On Vercel, the app is required by api/index.js and must not listen.
if (require.main === module) {
  app.listen(port, async () => {
    console.log(`VitaFit API listening on port ${port}`);
    await testConnection();
  });
}

module.exports = app;

