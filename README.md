# Grain Track project

## API

Full-stack application (API + frontend) for managing crops, locations, machines, operators and weighings.

This repository contains two main parts:

- `api/` — Node + TypeScript Express API server
- `app/` — React + Vite frontend

This README shows how to configure and start both the API and the frontend locally.

## Prerequisites

- Node.js (see `api/package.json` for the API engine requirement)
- npm or yarn
- Docker (for running a local Postgres instance)

## Quick start — run API and frontend locally

1. Create and run a local Postgres container (example):

```sh
# create a persistent docker volume for the DB data
docker volume create graintrack-postgres-data

# run Postgres (reads env variables from .env at repo root)
docker run -d --name postgres --env-file ../.env -p 5432:5432 \
	-v graintrack-postgres-data:/var/lib/postgresql/data postgres:18-alpine
```

2. Configure environment variables

Create a `.env` file in the repository root (or provide envs in your shell). Example `.env`:

```env
# Postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=graintrack
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# API
API_PORT=8080
JWT_SECRET=your_jwt_secret
CROSS_ENV=dev

# Optional: MIGRATION_VERSION (used for migrations in production)
```

The `api` dev script expects a `.env` one level above the `api/` folder (the repo root). If you keep `.env` in the repo
root the dev script will pick it up.

3. Start the API

```sh
cd api
npm install
npm run dev
```

- The API listens on `API_PORT` (default `8080`).
- The dev server runs the TypeScript sources (using `tsx --watch`).

Useful API commands (inside `api/`):

```sh
npm run typecheck   # run tsc to check types
npm run build       # build TypeScript to dist
npm start           # build + start production bundle (see api/package.json)
```

4. Start the frontend

```sh
cd app
npm install
npm run dev
```

- The frontend runs with Vite (default port 5173). Open the URL shown by Vite after start.
- To build a production bundle run `npm run build` and serve the `dist` directory with your preferred static server.

## How the dev setup works

- The backend looks for Postgres connection settings from environment variables (see `api/src/config/constants.ts`).
- On startup the API runs a quick DB verification and will run migrations if needed (`api/src/server.ts`).
- The frontend communicates with the API using relative paths — in development use a reverse-proxy or configure Vite to
  proxy API requests to the API port if needed.

## Development notes and tips

- If API requests are firing unexpectedly (duplicates), check the frontend router loaders and component effects —
  loaders run before route rendering and components may also dispatch load actions; add guards to avoid duplicate
  fetches.
- To monitor TypeScript warnings for the API use:

```sh
cd api
npm run typecheck -- --watch
```

- For the frontend you can run `npm run lint` and `npm run build` from `app/`.

## Docker compose (optional)

This repo contains `docker-compose.yaml` and `docker-compose.override.yaml` — you can use them for a more reproducible
local environment. Example:

```sh
# from repo root
docker compose up -d
```

(Compose file may set up API, DB and other services depending on configuration.)

## Troubleshooting

- If the API can't connect to Postgres, ensure the container is running and `.env` values match the container
  configuration.
- If the frontend cannot reach the API during development, configure a Vite proxy or run both services on the same
  host/port mapping.
- If you see duplicate fetches in dev, React Strict Mode may double-invoke effects; ensure your thunks/reducers are
  idempotent and add guards in components/loaders.

## Contributing

- Follow the project's lint and typecheck rules. Run type checks before creating PRs.
- See `api/README.md` or `app/README.md` if the repository includes sub-project READMEs for more details.
