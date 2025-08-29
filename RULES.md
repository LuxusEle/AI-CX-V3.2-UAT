
# RULES.md — Development & Business Logic Guardrails

This document defines **mandatory rules** for developers and operators of AI CX.

---

## 1. Business Logic Rules (Functional)
- **BOM Items**: must have name, qty > 0, waste_pct 0..50.
- **BOM Pricing**: effective qty = qty * (1 + waste_pct/100). Margin applied to unit_cost.
- **Vendor Catalog**: each SKU should have at least one vendor entry with cost and lead_days. Missing mapping must raise error.
- **Purchase Orders**: vendor required, at least one line, totals ≥ 0. Each line qty > 0, unit_cost ≥ 0.
- **Company Profile**: must exist before PDF/Email; includes name, address, phone, email, bank, terms.
- **Audit Logs**: every financial-impacting action must write to audit_logs.

---

## 2. AI & Assistant Rules
- **Assistant (“Sam”)**: may only call validated service functions (bom_service, po_service, etc.).
- **LLM Integration**: when added, must remain a thin parser/intent engine; tools must be deterministic Python services.
- **AI Modules**: predictive scoring, reporting, risk analysis, etc. must be added as new services (never embedded ad-hoc).

---

## 3. Security & Multi-Tenancy
- **Tenant Enforcement**: All queries and inserts must include tenant_id.
- **JWT Claims**: Production mode uses JWT-only to resolve tenant_id (no header fallback).
- **Postgres RLS**: Enabled in production. All tenant tables protected by `app.tenant_id` session variable.
- **RBAC**: Roles = admin, user. Admin-only routes must use `require_role("admin")`.

---

## 4. UAT → Production Transition
- During UAT: `UAT_MODE=true`, `PRODUCTION_HARDEN=false`. JWT + header fallback allowed.
- After AJ confirms **UAT PASS**:
  1. Run `scripts/post_uat.sh`.
  2. This flips `PRODUCTION_HARDEN=true` and `ENABLE_RLS=true`.
  3. From then, only JWT + RLS allowed.

**Special Rule**: Any module that has passed UAT must **not** be edited in future builds unless:
- The change is **backwards compatible** and documented.
- The developer proves no harm to logic flow, business rules, or API contracts.
- UI-only changes must be isolated; never rewrite a whole tested module for minor render fixes.

---

## 5. Coding Discipline Rules
- **Docstrings**: every function must state: what it does, where it pulls data, where it writes data, what logic it applies.
- **Rules Enforcement**: add checks in `rules/` package before DB writes.
- **Error Handling**: raise clear, descriptive errors; never silently fail.
- **Audit Trails**: log actor, action, target, payload, timestamp.

---

## 6. Deployment & Development Flow
- **Mock → Vercel**: marketing/front-end can be deployed to Vercel with API_URL pointing to backend.
- **API Deploy**: backend on Fly.io or Kubernetes with SSL (cert-manager).
- **AI/ML Linking**: only connect models/services via safe, sandboxed modules (`services/ai_*`). No inlined experimental code.
- **Modular Growth**: new features must be added module-by-module. Always track progress in BUILD_LOG.md.

---

## 7. Developer Guardrail
> **You cannot destroy a tested module just to fix a UI glitch.**  
> Modules that passed UAT are **protected assets**.  
> Any refactor must guarantee: same inputs → same outputs, same business flow.

