# Kanban Board

Monorepo with frontend (React + Vite) and backend (NestJS + TypeORM + PostgreSQL).

## Prerequisites

- Node.js 18+
- Yarn 1.x or npm (frontend uses Yarn; backend uses npm or Yarn)
- Docker (for PostgreSQL)

## Quick Start

### 1) Start PostgreSQL with Docker

```bash
# from repo root
docker run -d --name kanban-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kanban -p 5432:5432 postgres:15
```

To stop/remove later:
```bash
docker stop kanban-postgres && docker rm kanban-postgres
```

### 2) Backend (NestJS)

Location: `backend/`

Env (defaults provided in code, optional `.env`):
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=kanban
```

Install deps and run migrations:
```bash
# from repo root
cd backend
npm install
npm run migration:run
npm run dev  # starts http://localhost:3000
```

Endpoints relevantes:
- GET `/boards` – lista boards con columnas y tareas
- GET `/boards/seed` – si no hay datos, crea tablero y columnas por defecto
- POST `/tasks` – crear tarea `{ columnId, title, description? }`
- PATCH `/tasks/:id` – actualizar `{ title?, description? }`
- PATCH `/tasks/:id/move` – mover `{ toColumnId }`
- PATCH `/tasks/:id/archive` – archivar (soft delete)
- PATCH `/tasks/:id/restore` – restaurar

Tests backend (Jest):
```bash
npm run test       # unit tests
npm run test:watch
npm run test:cov
```

### 3) Frontend (React + Vite)

Location: `frontend/`

Env (opcional):
```
VITE_API_URL=http://localhost:3000
```

Instalar deps y levantar dev server:
```bash
# from repo root
cd frontend
yarn
yarn start  # http://localhost:5173
```

Tests frontend (Vitest + Testing Library):
```bash
yarn test       # run once
yarn test:watch # watch mode
```

## Project Scripts Summary

- Backend
  - `npm run dev` – iniciar NestJS en watch mode
  - `npm run migration:run` – ejecutar migraciones TypeORM
  - `npm run test`/`test:watch`/`test:cov` – ejecutar tests con Jest
- Frontend
  - `yarn start` – iniciar Vite dev server
  - `yarn test`/`test:watch` – ejecutar tests con Vitest

## Notes

- IDs usan enteros autoincrementales en DB y en el FE.
- DnD en FE via `@dnd-kit/core`; para eliminar tareas hay botón Trash en cada tarjeta.
- Alertas de éxito/error visibles en App; el éxito se oculta automáticamente.
