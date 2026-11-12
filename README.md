# Task Manager

A task manager with two apps. The API stores tasks in SQLite. The web app lists those tasks and lets you create, edit, and delete them.

## Tech stack

- API: NestJS, Prisma 6.19.3, SQLite, class-validator
- Web: Next.js 16.4.6, React 19.3.0, TypeScript, Tailwind CSS, shadcn/ui

## Prerequisites

- Node.js 20.9.0 or newer
- pnpm 11.24.0

Both `api/package.json` and `web/package.json` set `packageManager` to `pnpm@11.24.0`. Enable Corepack so that version is used:

```bash
corepack enable
```

## Project structure

```text
api/
  prisma/schema.prisma
  prisma/migrations/
  src/main.ts
  src/prisma/
  src/tasks/
  .env.example
  package.json
web/
  src/app/
  src/components/
  src/lib/
  src/types/
  .env.example
  package.json
```

`api` and `web` are separate pnpm projects. Install and run each one on its own.

## Setup and run

1. Clone the repository and enter it:

```bash
git clone <repository-url>
cd <repository-directory>
```

2. Set up and start the API:

```bash
cd api
pnpm install
cp .env.example .env
pnpm prisma migrate deploy
pnpm start:dev
```

The API runs at http://localhost:3001.

3. In a second terminal, set up and start the web app from the repository root:

```bash
cd web
pnpm install
cp .env.example .env.local
pnpm dev
```

The web app runs at http://localhost:3000.

4. Start the API before using the web app. The web app reads tasks from the API.

## Environment variables

### API

Copy `api/.env.example` to `api/.env`.

| Name | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | SQLite database file used by Prisma | `file:./dev.db` |
| `PORT` | Port the API listens on | `3001` |
| `FRONTEND_ORIGIN` | Browser origin allowed by CORS | `http://localhost:3000` |

The API exits on startup if `FRONTEND_ORIGIN` is not set. If `PORT` is not set, it listens on port 3000.

### Web

Copy `web/.env.example` to `web/.env.local`.

| Name | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the API | `http://localhost:3001` |

## API endpoints

The task fields are `id`, `title`, `description`, `status` (`TODO`, `IN_PROGRESS`, or `DONE`), `dueDate`, and `createdAt`.

Invalid request data returns 400. A task id that does not exist returns 404. A non-numeric id also returns 400.

| Method | Path | Description | Success | Errors |
| --- | --- | --- | --- | --- |
| `GET` | `/tasks` | List all tasks | 200 | |
| `GET` | `/tasks/:id` | Get one task | 200 | 400, 404 |
| `POST` | `/tasks` | Create a task. `title` is required. `description`, `status`, and `dueDate` are optional. `status` defaults to `TODO`. | 201 | 400 |
| `PATCH` | `/tasks/:id` | Update a task. Send only the fields to change. `title`, when sent, must be a non-empty string. | 200 | 400, 404 |
| `DELETE` | `/tasks/:id` | Delete a task | 200 | 400, 404 |

`POST /tasks` body:

```json
{
  "title": "Fix login bug",
  "description": "Users reporting a 401 error",
  "status": "TODO",
  "dueDate": "2026-12-01T00:00:00.000Z"
}
```

## Features

- Task table with the title, description, status badge, due date, and created date
- Create and edit in one dialog, validated before submit
- Confirmation dialog before delete
- Loading, error, and empty states
- Success and error toasts
- Filter by status
- Sort by due date, with tasks that have no due date last

## Troubleshooting

- Prisma Client is missing. `pnpm install` in `api` runs `prisma generate`. If that step was skipped, run `pnpm prisma generate` in `api`. The install must be allowed to run the Prisma build scripts listed in `api/pnpm-workspace.yaml`.
- The Node.js version is too old. Next.js 16.4.6 requires Node.js 20.9.0 or newer.
- Port 3000 or 3001 is already in use. Stop the other process, or the web app may start on a different port. CORS only allows `http://localhost:3000`.
- The browser shows a CORS or network error. `FRONTEND_ORIGIN` must be the web app origin, and `NEXT_PUBLIC_API_URL` must be the API origin. Restart both apps after changing either value.
- The task list fails to load. Confirm the API is running at the URL in `web/.env.local`, and that `pnpm prisma migrate deploy` has been run in `api`.

## How I used AI

I used Cursor to generate parts of the code and Claude to plan the architecture and UI prompts.

What I changed or fixed in the generated code:

- TODO: the author will fill this in
