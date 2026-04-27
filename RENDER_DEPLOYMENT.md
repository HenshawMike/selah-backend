# Render Deployment Preparation - Backend

I have prepared the backend for Render deployment.

## Deployment Methods

I have added two ways to deploy your backend to Render:

### 1. Using Render Blueprints (Recommended)
I have created a `render.yaml` file at the root of your project. 
- Go to **Blueprints** in the Render dashboard.
- Connect your GitHub repository.
- Render will automatically detect the `render.yaml` and set up the service with the correct settings.

### 2. Using Docker (Included)
I have created a `Dockerfile` in the `backend` directory.
- When creating a **Web Service**, select **Docker** as the runtime.
- Set the **Root Directory** to `backend`.
- Render will build the image and deploy it.

## Manual Configuration (If not using Blueprints)

If you prefer to configure it manually in the Render UI:

1.  **Runtime**: `Docker` (or `Node` if you prefer not to use the Dockerfile)
2.  **Root Directory**: `backend`
3.  **Build Command** (for Node): `pnpm install; pnpm build`
4.  **Start Command** (for Node): `pnpm start`

## Environment Variables

Add these variables in the **Environment** section of your Render service:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | `https://hoczlisipgmzqjqsvrap.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Your service role key)* |
| `WHATSAPP_VERIFY_TOKEN` | `selah_9xK!p2L_secure_token` |
| `WHATSAPP_ACCESS_TOKEN` | *(Your access token)* |

> **Note**: Render will automatically provide the `PORT` environment variable, and the server is already configured to use it.

## Local Verification

To test the build process locally:
```bash
cd backend
pnpm build
pnpm start
```

## CORS Note
Ensure your frontend URL (`https://selare.netlify.app`) is allowed in `server.ts`. I have already configured this for you.
