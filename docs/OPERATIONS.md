# Operations Playbook

## Deploy
- Build images via CI → push to registry → deploy stack (compose/k8s)
- Run `alembic upgrade head` on startup (idempotent)

## Backups
- Nightly Postgres backups
- Object storage versioning enabled
- Test restore monthly

## Monitoring
- Error tracking (Sentry)
- Metrics (OTel → Prometheus/Grafana)
- Celery queue depth alarms

## Security
- Rotate JWT secret and refresh secret every 90 days
- Enforce HTTPS and `SameSite=Strict` cookies if you move to cookie-based auth
- RLS for Postgres recommended for added safety
