# AIWorkspace

AI-powered monorepo — FastAPI backend, SvelteKit frontend, and room for future services.

## Project Structure

```
AIWorkspace/
├── backend/           # FastAPI — main API service
├── web/               # SvelteKit — frontend application
├── worker/            # (future) background task service (arq / celery)
├── ml-service/        # (future) AI/ML inference service
├── docker-compose.yml # orchestration
└── README.md
```

Each service is fully self-contained with its own dependencies, env config, and lockfile.

## Running with Docker

```bash
cp backend/.env.example backend/.env

docker compose up --build        # build and start all services
docker compose up -d --build     # same, in background
docker compose up backend        # only backend
docker compose down              # stop all
```

| Service   | URL                        |
|-----------|----------------------------|
| `backend` | http://localhost:8000      |
| `web`     | http://localhost:3000      |

## Local Development

### `backend/` — FastAPI

Python API service built with FastAPI, managed with uv.

**Stack:** FastAPI · Uvicorn · Dependency Injector · Pydantic · Loguru

```bash
cd backend

cp .env.example .env     # configure environment
uv sync --group dev      # install dependencies

make start               # dev server → http://localhost:8000
make test                # run tests
make lint                # ruff check
make fmt                 # ruff format
```

API docs: http://localhost:8000/api/docs · http://localhost:8000/api/redoc

### `web/` — SvelteKit

Frontend application built with SvelteKit (Svelte 5) following FSD v2 architecture.

**Stack:** SvelteKit · Svelte 5 · TypeScript · pnpm

```bash
cd web

pnpm install             # install dependencies
pnpm dev                 # dev server → http://localhost:5173
pnpm build               # production build
pnpm preview             # preview production build
```

### `worker/` — Background Tasks _(future)_

Async task queue for heavy or deferred operations (e.g., AI processing, notifications).

```bash
cd worker
uv sync
make start
```

### `ml-service/` — ML/AI Inference _(future)_

Dedicated service for AI model inference, isolated from the main API for independent scaling.

```bash
cd ml-service
uv sync
make start               # inference server → http://localhost:8001
```

## Environment Variables

Each service has its own `.env.example`. Copy and configure before running:

```bash
cp backend/.env.example backend/.env
# cp worker/.env.example worker/.env
# cp ml-service/.env.example ml-service/.env
```

### `backend/.env`

| Variable    | Default       | Description        |
|-------------|---------------|--------------------|
| `APP_NAME`  | `AIWorkspace` | Application name   |
| `DEBUG`     | `false`       | Debug / hot reload |
| `HOST`      | `0.0.0.0`     | Server host        |
| `PORT`      | `8000`        | Server port        |
| `LOG_LEVEL` | `INFO`        | Logging level      |
