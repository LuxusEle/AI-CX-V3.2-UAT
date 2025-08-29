# Development Guide

## Stack overview
- **Backend**: FastAPI + SQLAlchemy + Alembic, Postgres (`pgvector` ready), Celery + Redis
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind
- **Auth**: email/password + JWT (access + refresh)
- **Multi-tenancy**: `tenant_id` on all rows; middleware enforces scoping

## Conventions
- All API routes require Bearer access token unless noted
- `X-Tenant-ID` header must be present (validated against user’s tenant)
- Request/response schemas live in `src/schemas`
- DB models in `src/models`
- Route handlers in `src/routers`
- Business logic in `src/services`

## Running locally
```bash
make dev        # start all services
make migrate    # run DB migrations
make seed       # create a demo tenant + admin
```

## Migrations
Use Alembic. Models are in `src/models`. When you change models:
```bash
docker compose exec api alembic revision --autogenerate -m "desc"
make migrate
```

## Seeding
`make seed` runs `scripts/seed_demo.py`, creating:
- tenant: `Demo Co.`
- admin: `admin@demo.test` / `demo1234`

## AI agent
- Stubs in `src/services/ai_agent.py`
- Plug in your embeddings + LLM in this file
- Vector schema prepared (see migrations that enable `pgvector`)

## Testing
```bash
make test
```

## Build log & handover
- Keep `/docs/BUILD_LOG.md` updated (or use `scripts/buildlog.py` as a post-commit hook)
- Before handover, fill `/docs/HANDOVER.md` completely
