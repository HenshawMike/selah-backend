# Railway Deployment Preparation - Backend

I have prepared the backend for Railway deployment by adding the necessary scripts and configuration.

## Changes Made

1.  **Updated `package.json`**: Added `build` and `start` scripts.
    - `build`: `tsc` (Compiles TypeScript to JavaScript in the `dist` folder)
    - `start`: `node dist/server.js` (Runs the compiled server)
2.  **Updated `src/server.ts`**: Improved `.env` loading logic to be compatible with both local development and production environments.
3.  **Added `Procfile`**: Explicitly tells Railway to use `pnpm start` for the web process.

## Next Steps for Railway UI

When you create the service in Railway, make sure to:

1.  **Set the Root Directory**: If you are deploying the entire repository, set the **Root Directory** to `backend` in the service settings.
2.  **Add Environment Variables**: You will need to add the following variables in the Railway dashboard (copied from your `.env`):

| Variable | Recommended Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` (Railway will usually override this, which is fine) |
| `SUPABASE_URL` | `https://hoczlisipgmzqjqsvrap.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_supabase_service_role_key` |
| `WHATSAPP_VERIFY_TOKEN` | `selah_9xK!p2L_secure_token` |
| `WHATSAPP_ACCESS_TOKEN` | `your_whatsapp_access_token` |

## Local Verification

You can verify the build process locally by running:
```bash
cd backend
pnpm build
pnpm start
```
