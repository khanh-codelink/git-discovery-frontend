# Git Discovery

A React and TypeScript frontend built with Vite. The app uses Supabase for Google sign-in and can request profile data from a FastAPI backend.

## Prerequisites

- Node.js 22.12 or newer (or Node.js 20.19 or newer)
- npm
- A Supabase project configured with Google OAuth
- The FastAPI backend, if you want to load profile data

## Setup

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Create your local environment file:

   ```sh
   cp example.env .env.local
   ```

3. Set the values in `.env.local`:

   ```dotenv
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-supabase-publishable-key"
   VITE_API_URL="http://localhost:8000"
   ```

   Use your Supabase project URL and publishable (or legacy `anon`) key. Set `VITE_API_URL` to the base URL of your FastAPI backend. The app requests `GET /api/profile` and sends the signed-in user's access token as a bearer token.

4. In Supabase, enable Google as an authentication provider and allow your local app URL (typically `http://localhost:5173`) in the project's redirect URL settings.

## Run locally

Start the Vite development server:

```sh
npm run dev
```

@@## Run locally
@@Open the local URL printed in the terminal, usually
Open the local URL printed in the terminal, usually `http://localhost:5173`. The dev server supports hot module replacement.

## Deploy

### Vercel

Import this repository in Vercel and keep the detected Vite defaults (`npm run build` and `dist`). Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_URL` under the project's environment variables for each deployment environment. These values are embedded in the browser build; only use public client credentials, never server secrets. Add the deployed site URL to the allowed redirect URLs in Supabase's authentication settings.

Vercel builds and serves this frontend using its managed build platform; it does not deploy this repository as a user-provided Docker container. The included Docker image is for container hosts that support Docker.

### Docker

Build the production image, passing the same public Vite environment variables at build time:

```sh
docker build \
   --build-arg VITE_SUPABASE_URL="https://your-project.supabase.co" \
   --build-arg VITE_SUPABASE_ANON_KEY="your-supabase-publishable-key" \
   --build-arg VITE_API_URL="https://your-api.example.com" \
   -t git-discovery-frontend .
```

Run it locally on port 8080:

```sh
docker run --rm -p 8080:80 git-discovery-frontend
```

Open `http://localhost:8080`.

## Available commands

```sh
npm run dev      # Start the development server
npm run build    # Type-check and build for production
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```