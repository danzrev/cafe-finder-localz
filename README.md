# Café Finder Localz ☕

**Café Finder** — a community-powered directory of cafés in **Davao City, Philippines**. Discover, rate, save, and explore the best coffee spots in the city.

This is a monorepo built with npm workspaces.

## Tech Stack

| Layer       | Technology                                        |
| ----------- | ------------------------------------------------- |
| Frontend    | React 19 · Vite · Tailwind CSS · React Router · Lucide React · Framer Motion |
| Backend     | Node.js · Express · Prisma ORM                    |
| Database    | PostgreSQL                                        |
| Auth        | Custom email/password auth · Argon2 hashing · HTTP-only cookies · JWT |
| Security    | Helmet · CORS · Morgan · rate limiting · input validation |
| Maps        | Google Maps JavaScript API (via env key)          |
| Images      | External storage (S3-compatible / Cloudinary)     |

## Repo Layout

```
/
├── shared/    # Shared TypeScript types & validation (client + server)
├── client/    # React frontend (Vite)
├── server/    # Express + Prisma backend
└── package.json  # npm workspaces root
```

## Quick Start

Prerequisites: Node.js ≥ 20, PostgreSQL running locally (or a DATABASE_URL).

```bash
# 1. Install all workspace dependencies
npm install

# 2. Configure environment variables (see each folder's .env.example)
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Set up the database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 4. Run both server and client together
npm run dev
```

- Client dev server: http://localhost:5173
- API server: http://localhost:4000

## Scripts

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Run server + client together         |
| `npm run build`       | Build all workspaces (TS)            |
| `npm run typecheck`   | Type-check all workspaces            |
| `npm run prisma:migrate` | Run database migrations           |
| `npm run db:studio`   | Open Prisma Studio                   |

## Environment Variables

Each package ships a `.env.example` describing every variable it needs. Copy to `.env` and fill in real values:

- `client/.env.example` — Vite public vars (API base URL, maps key, storage, storage preset)
- `server/.env.example` — server port, Postgres connection, JWT secret, rate limiting, CORS origin, storage credentials, maps server key

> **Never commit real secrets.** The `.gitignore` excludes all `.env` files.

## License

Private project.