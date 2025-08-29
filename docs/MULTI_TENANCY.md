# Multi-Tenancy Guardrails (Day 1)

**Rules:**
1) Every row has `tenant_id`. No exceptions.
2) Every request includes `X-Tenant-ID`. Backend verifies it matches the token's `tenant_id` claim.
3) Prefer Postgres RLS when ready:
   - Enable RLS; policies: `tenant_id = current_setting('app.tenant_id')::int`
   - Set `app.tenant_id` at session open via middleware.
4) JWT:
   - Short-lived access, long-lived refresh.
   - Claims include `sub = user_id`, `tenant_id`, `role`.
5) File access:
   - Use signed URLs. Prefix keys by `tenant_id/`.
6) Audit everything that moves money or changes BOM.

**Migration from header to claims:**
- Today we accept `X-Tenant-ID`; after auth, set DB session var and/or enforce RLS.
- Update UI to not pass headers once claims/RLS enforced.

**SSL:**
- Always terminate TLS at the ingress (Kubernetes) or the platform (Render/Fly).
- Force HTTPS redirects in reverse proxy; disable HTTP.
