# Nexus ERP SaaS Starter (Python + Next.js)

A **ready-to-clone** template for an AI-powered ERP SaaS:
- **Backend**: FastAPI, Postgres (pgvector-ready), SQLAlchemy, Alembic, JWT auth, Celery + Redis.
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind, shadcn-ready.
- **Infra**: Docker Compose for dev, GitHub Actions CI stub, S3-compatible storage hooks.
- **Multi-tenancy**: `tenant_id` on all core entities; server-side enforcement.
- **Docs**: Development guide, Error handling, Ops playbook, Handover checklist, Build log template.

> Philosophy: **Python is the brain** (rules, workflows, AI), **Next.js is the face** (SaaS UI).

## Quick start

```bash
# prerequisites: Docker, docker-compose, make
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# dev up
make dev

# first-time DB migration + seed demo tenant
make migrate
make seed
```

- API: http://localhost:8000 (Swagger at `/docs`)
- Web: http://localhost:3000

## What's included
- Auth: email/password, access + refresh JWT (Bearer). (HttpOnly cookie integration is trivial to add later)
- Entities: tenants, users, clients, projects, bom_items, vendors, purchase_orders, audit_logs
- Endpoints: `auth`, `clients`, `projects`, `boms`, `vendors`, `pos`, `health`
- Celery worker ready for long-running tasks (PDFs, AI tools) — **stubs provided**
- AI Agent stubs and vector schema (use `pgvector` in Postgres)

## Repo layout
```
/apps
  /api        # FastAPI backend
  /web        # Next.js frontend
/docs         # Guides and playbooks
/infra        # CI, scripts, db init
```

## Production notes
- Switch secrets to your cloud secret manager.
- Put Postgres behind a private network; enable RLS and/or schema per tenant if needed.
- Add Sentry + OpenTelemetry (hooks included in code comments).
- Stripe (or your PSP) webhook endpoint is sketched in `apps/api/src/routers/payments.py` (stub).

---

See `/docs/DEVELOPMENT.md` to understand conventions and day-2 operations.


---

## v2 Additions (2025-08-29)
- **Quotes module**: DB models + CRUD.
- **PDF Quote/Estimate generator** (ReportLab) styled to mirror your provided template (sections, totals, bank block, terms).
- **Rules engine**: `apps/api/src/rules/` with sanity checks for Quotes/BOM (compulsory validations + handover hooks).
- **Web UI**: Quotes list/create and "Generate PDF" action (Tailwind).
- **Deployment docs**: Vercel (web) + Kubernetes manifests (API) + SSL via cert-manager.
- **Stronger guardrails**: Multi-tenancy conventions, security checklist, hydration-error avoidance tips.

## v3.1 — BOM/PO logic + Sam assistant
- BOM pricing + PO splitting by vendor
- Vendor catalog + PO lines models and migration
- 'Sam' assistant page (`/assistant`) with tool actions
- Tenant resolution from JWT claims (fallback to header)
- Docs: BOM_PO_RULES, AGENT, WORKFLOWS

## v3.2-UAT — Roles & UAT Switch
- Roles: admin/user, admin UI at `/admin/users`
- Seeded users:
  - admin: admin@demo.test / demo1234
  - user:  user@demo.test  / demo1234
- Env flags: `UAT_MODE=true`, `PRODUCTION_HARDEN=false` → flip after UAT
