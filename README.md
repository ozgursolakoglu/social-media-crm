# Social Media CRM

Schedule Instagram and Facebook posts in advance. Built with React, Vite, Node.js, Express and SQLite.

## Local development

```bash
# Install all dependencies (root, server, client)
npm run install-all

# Start backend (port 5000) + frontend (port 3000) together
npm run dev
```

- API: `http://localhost:5000`
- App: `http://localhost:3000`
- Default login: `admin@example.com` / `admin123`

## Deploy to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/social-media-crm.git
git branch -M main
git push -u origin main
```

## Deploy to Netlify

1. Connect your GitHub repository to Netlify.
2. Build command: `npm run build` (runs in root, builds `client`)
3. Publish directory: `client/dist`
4. Add environment variables in Netlify (see `server/.env.example`):
   - `JWT_SECRET`
   - `PORT`
5. Deploy. API routes are served via `netlify/functions/`.

> **Note:** The local backend uses SQLite (`server/database.sqlite`). Netlify serverless functions are ephemeral, so writes to SQLite won't persist in production. For production, replace the SQLite layer with PostgreSQL/Supabase or another managed database.

## Posting to Instagram / Facebook

The `server/routes/meta.js` and `server/services/metaPublisher.js` contain stubs. To post live:
1. Create a Meta app and obtain Page/Instagram access tokens (Graph API).
2. Store tokens in `platforms.access_token`.
3. Implement the Graph API calls in `metaPublisher.js`.
