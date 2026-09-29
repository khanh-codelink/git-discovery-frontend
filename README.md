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

Open the local URL printed in the terminal, usually `http://localhost:5173`. The dev server supports hot module replacement.

## Available commands

```sh
npm run dev      # Start the development server
npm run build    # Type-check and build for production
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```