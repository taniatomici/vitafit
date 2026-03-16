# Deploy VitaFit Backend on Vercel

## 1. Install Vercel CLI (optional)

```bash
npm i -g vercel
```

## 2. Deploy from the backend folder

```bash
cd backend
vercel
```

Follow the prompts (link to existing project or create new one). Deploy with **production** when ready.

Or connect the **backend** folder to Vercel via the dashboard:

- **Import** a Git repo, or drag the `backend` folder.
- Set **Root Directory** to `backend` (if the repo root is the parent).
- **Framework Preset**: Other.
- **Build Command**: leave empty or `npm install`.
- **Output Directory**: leave empty.
- **Install Command**: `npm install`.

## 3. Environment variables

In the Vercel project: **Settings → Environment Variables**, add:

| Name         | Value                    | Notes                    |
|--------------|--------------------------|--------------------------|
| `DB_HOST`    | your-aiven-host.com      | MySQL host               |
| `DB_PORT`    | 27575                    | MySQL port               |
| `DB_USER`    | avnadmin                 | DB user                  |
| `DB_PASSWORD`| ***                      | DB password              |
| `DB_NAME`    | defaultdb                | Database name            |

Redeploy after changing env vars.

## 4. API URL

After deploy you’ll get a URL like:

`https://vitafit-backend-xxx.vercel.app`

- Health: `GET https://your-project.vercel.app/api/`  
  (or the root path Vercel assigns to the function)
- API base: `https://your-project.vercel.app/api`

Update the frontend `api.js`: set `baseUrl` to `https://your-project.vercel.app/api`.

## 5. Limits and behavior

- **Request body**: Vercel has a ~4.5 MB body limit (Hobby). Large progress uploads (e.g. many/small images) may hit this; reduce size or use external storage.
- **Progress photos**: On Vercel the app uses `/tmp` for uploads. Files are **ephemeral** (lost after the request). For persistent photos, use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or another storage and store URLs in the DB.
- **Cold starts**: First request after idle can be slower (MySQL connection + serverless spin-up).

## 6. Local vs Vercel

- **Local**: `npm run dev` in `backend` — full API + file uploads to `content/`.
- **Vercel**: API and DB work; progress photo files are not stored permanently unless you add Blob (or similar) and change the progress route to upload there and save the returned URL.
